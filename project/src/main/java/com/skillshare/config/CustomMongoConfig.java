package com.skillshare.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;
import org.springframework.data.mongodb.core.convert.DefaultDbRefResolver;
import org.springframework.data.mongodb.core.convert.DefaultMongoTypeMapper;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.data.mongodb.core.index.IndexOperations;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import java.util.concurrent.TimeUnit;
import org.springframework.beans.factory.annotation.Autowired;

@Configuration
@EnableMongoRepositories(basePackages = "com.skillshare.repository")
@Slf4j
public class CustomMongoConfig {

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    @Value("${spring.data.mongodb.database}")
    private String databaseName;
    
    @Autowired
    private MongoConverters mongoConverters;

    @Bean
    public MongoClient mongoClient() {
        MongoClientSettings settings = MongoClientSettings.builder()
            .applyConnectionString(new ConnectionString(mongoUri))
            .applyToConnectionPoolSettings(builder -> 
                builder.maxConnectionIdleTime(30000, TimeUnit.MILLISECONDS)
                    .maxSize(50)
                    .minSize(10)
            )
            .applyToSocketSettings(builder ->
                builder.connectTimeout(20000, TimeUnit.MILLISECONDS)
                    .readTimeout(60000, TimeUnit.MILLISECONDS)
            )
            .build();

        return MongoClients.create(settings);
    }

    @Bean
    public MongoDatabaseFactory mongoDatabaseFactory() {
        return new SimpleMongoClientDatabaseFactory(mongoClient(), databaseName);
    }

    @Bean
    public MongoTemplate mongoTemplate() {
        // Create mapping context
        MongoMappingContext mappingContext = new MongoMappingContext();
        
        // Create the converter with the non-deprecated constructor
        MappingMongoConverter converter = new MappingMongoConverter(
            new DefaultDbRefResolver(mongoDatabaseFactory()),
            mappingContext
        );
        
        // Remove _class field from documents
        converter.setTypeMapper(new DefaultMongoTypeMapper(null));
        
        // Use the customConversions bean from MongoConverters
        converter.setCustomConversions(mongoConverters.customConversions());
        
        // Initialize the converter
        converter.afterPropertiesSet();
        
        MongoTemplate mongoTemplate = new MongoTemplate(mongoDatabaseFactory(), converter);
        
        // Create indexes
        try {
            IndexOperations indexOps = mongoTemplate.indexOps("users");
            Index emailIndex = new Index()
                .on("email", Sort.Direction.ASC)
                .unique();
                
            indexOps.ensureIndex(emailIndex);
            log.info("MongoDB indexes created successfully");
        } catch (Exception e) {
            log.error("Error creating MongoDB indexes", e);
            throw e;
        }
        
        return mongoTemplate;
    }
}