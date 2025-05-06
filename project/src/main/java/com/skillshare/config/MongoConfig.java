package com.skillshare.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.convert.DefaultMongoTypeMapper;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.beans.factory.annotation.Value;
import com.mongodb.MongoException;
import org.springframework.lang.NonNull;
import lombok.extern.slf4j.Slf4j;
import java.util.concurrent.TimeUnit;
import java.util.ArrayList;
import java.util.List;
import org.springframework.core.convert.converter.Converter;

@Slf4j
@Configuration
@EnableMongoRepositories(basePackages = "com.skillshare.repository")
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    @Value("${spring.data.mongodb.database}")
    private String databaseName;

    @Value("${spring.data.mongodb.connection-pool-max-size:50}")
    private int maxConnectionPoolSize;

    @Value("${spring.data.mongodb.connection-pool-min-size:10}")
    private int minConnectionPoolSize;

    @Value("${spring.data.mongodb.max-connection-idle-time:60000}")
    private int maxConnectionIdleTime;

    @Value("${spring.data.mongodb.connect-timeout:20000}")
    private int connectTimeout;

    @Value("${spring.data.mongodb.socket-timeout:60000}")
    private int socketTimeout;

    @Override
    @NonNull
    protected String getDatabaseName() {
        return databaseName;
    }

    @Override
    protected boolean autoIndexCreation() {
        return true;
    }

    @Override
    @Bean
    @NonNull
    public MongoClient mongoClient() {
        try {
            log.info("Initializing MongoDB client with URI: {}", mongoUri.replaceAll("://.*@", "://*****@"));
            ConnectionString connectionString = new ConnectionString(mongoUri);
            MongoClientSettings settings = MongoClientSettings.builder()
                .applyConnectionString(connectionString)
                .applyToConnectionPoolSettings(builder -> {
                    builder.maxSize(maxConnectionPoolSize)
                           .minSize(minConnectionPoolSize)
                           .maxConnectionIdleTime(maxConnectionIdleTime, TimeUnit.MILLISECONDS);
                    log.debug("Configured connection pool: max={}, min={}, idleTime={}ms", 
                             maxConnectionPoolSize, minConnectionPoolSize, maxConnectionIdleTime);
                })
                .applyToSocketSettings(builder -> {
                    builder.connectTimeout(connectTimeout, TimeUnit.MILLISECONDS)
                           .readTimeout(socketTimeout, TimeUnit.MILLISECONDS);
                    log.debug("Configured socket settings: connectTimeout={}ms, readTimeout={}ms", 
                             connectTimeout, socketTimeout);
                })
                .build();
            
            MongoClient client = MongoClients.create(settings);
            
            // Verify connection
            log.info("Testing MongoDB connection...");
            client.getDatabase(getDatabaseName()).runCommand(new org.bson.Document("ping", 1));
            log.info("Successfully connected to MongoDB database: {}", getDatabaseName());
            
            return client;
        } catch (MongoException e) {
            String errorMessage = String.format("Failed to create MongoDB client: %s", e.getMessage());
            log.error(errorMessage, e);
            throw new RuntimeException(errorMessage, e);
        }
    }

    @Bean
    @NonNull
    public MongoTemplate mongoTemplate() {
        try {
            log.debug("Creating MongoTemplate...");
            MongoTemplate template = new MongoTemplate(mongoClient(), getDatabaseName());
            MappingMongoConverter converter = (MappingMongoConverter) template.getConverter();
            
            // Remove _class field from documents
            converter.setTypeMapper(new DefaultMongoTypeMapper(null));
            log.debug("Configured MongoConverter to remove _class field");
            
            // Set up custom conversions if needed
            converter.setCustomConversions(customConversions());
            
            // Set up mapping context
            MongoMappingContext mappingContext = (MongoMappingContext) converter.getMappingContext();
            mappingContext.setAutoIndexCreation(true);
            log.debug("Enabled auto index creation");
            
            converter.afterPropertiesSet();
            log.info("Successfully created MongoTemplate");
            return template;
        } catch (Exception e) {
            String errorMessage = String.format("Failed to create MongoTemplate: %s", e.getMessage());
            log.error(errorMessage, e);
            throw new RuntimeException(errorMessage, e);
        }
    }

    @Bean
    @Override
    @NonNull
    public MongoCustomConversions customConversions() {
        List<Converter<?, ?>> converters = new ArrayList<>();
        converters.add(new MongoConverters.DateToLocalDateTimeConverter());
        converters.add(new MongoConverters.LocalDateTimeToDateConverter());
        return new MongoCustomConversions(converters);
    }
}