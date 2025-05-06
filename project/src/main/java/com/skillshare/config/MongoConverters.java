package com.skillshare.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;
import org.springframework.lang.NonNull;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.Date;

@Configuration
public class MongoConverters {

    @Bean
    public MongoCustomConversions customConversions() {
        return new MongoCustomConversions(Arrays.asList(
            new DateToLocalDateTimeConverter(),
            new LocalDateTimeToDateConverter()
        ));
    }

    public static class DateToLocalDateTimeConverter implements Converter<Date, LocalDateTime> {
        @Override
        public LocalDateTime convert(@NonNull Date source) {
            return source == null ? null :
                LocalDateTime.ofInstant(source.toInstant(), ZoneId.systemDefault());
        }
    }

    public static class LocalDateTimeToDateConverter implements Converter<LocalDateTime, Date> {
        @Override
        public Date convert(@NonNull LocalDateTime source) {
            return source == null ? null :
                Date.from(source.atZone(ZoneId.systemDefault()).toInstant());
        }
    }
}