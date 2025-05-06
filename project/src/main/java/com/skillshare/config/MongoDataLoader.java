package com.skillshare.config;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.ValidationOptions;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class MongoDataLoader implements CommandLineRunner {

    private final MongoTemplate mongoTemplate;

    @Override
    public void run(String... args) {
        try {
            MongoDatabase db = mongoTemplate.getDb();
            
            // Create users collection with validation
            if (!mongoTemplate.collectionExists("users")) {
                db.createCollection("users");
                
                Document userValidator = Document.parse("""
                    {
                        $jsonSchema: {
                            bsonType: "object",
                            required: ["email", "password", "name"],
                            properties: {
                                email: {
                                    bsonType: "string",
                                    pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
                                },
                                password: {
                                    bsonType: "string",
                                    minLength: 6
                                },
                                name: {
                                    bsonType: "string",
                                    minLength: 2
                                },
                                enabled: {
                                    bsonType: "bool"
                                },
                                profilePicture: {
                                    bsonType: ["string", "null"]
                                },
                                bio: {
                                    bsonType: ["string", "null"],
                                    maxLength: 500
                                }
                            }
                        }
                    }
                """);

                ValidationOptions validationOptions = new ValidationOptions().validator(userValidator);
                db.getCollection("users").drop();
                db.createCollection("users", new com.mongodb.client.model.CreateCollectionOptions()
                    .validationOptions(validationOptions));
                
                // Create indexes
                db.getCollection("users").createIndex(new Document("email", 1), 
                    new com.mongodb.client.model.IndexOptions().unique(true));
            }
            
            log.info("MongoDB collections and validation rules initialized successfully");
        } catch (Exception e) {
            log.error("Error initializing MongoDB collections and validation", e);
            throw new RuntimeException("Failed to initialize database", e);
        }
    }
}