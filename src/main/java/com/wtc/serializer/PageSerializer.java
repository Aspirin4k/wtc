package com.wtc.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.springframework.boot.jackson.JsonComponent;
import org.springframework.data.domain.Page;

import java.io.IOException;

@JsonComponent
public class PageSerializer extends JsonSerializer<Page> {
    @Override
    public void serialize(
            Page page,
            JsonGenerator jsonGenerator,
            SerializerProvider serializerProvider
    ) throws IOException {
        jsonGenerator.writeStartObject();
        jsonGenerator.writeNumberField("total", page.getTotalElements());
        jsonGenerator.writeBooleanField(
                "has_more",
                page.getPageable().getOffset() + page.getContent().size() < page.getTotalElements()
        );

        serializerProvider.defaultSerializeField("items", page.getContent(), jsonGenerator);

        jsonGenerator.writeEndObject();
    }
}
