package petadoption.api.milvus;

import io.milvus.client.MilvusClient;
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MilvusConfig {


    @Value("${milvus.endpoint}")
    String milvusEndpoint;

    @Bean
    public MilvusClientV2 milvusClient() {
        ConnectConfig connectConfig = ConnectConfig.builder()
                .uri(milvusEndpoint).build();

        return new MilvusClientV2(connectConfig);
    }
}
