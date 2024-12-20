package petadoption.api.milvus;

import io.milvus.client.MilvusClient;
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "milvus")
public class MilvusConfig {


    @Value("${milvus.endpoint}")
    String milvusEndpoint;

    @Bean
    @ConditionalOnExpression("#{${milvus.enabled}}")
    public MilvusClientV2 milvusClient() {
        try {
            ConnectConfig connectConfig = ConnectConfig.builder()
                    .uri(milvusEndpoint).build();

            return new MilvusClientV2(connectConfig);
        } catch (Exception e) {
            System.err.println(e.getMessage());
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
}
