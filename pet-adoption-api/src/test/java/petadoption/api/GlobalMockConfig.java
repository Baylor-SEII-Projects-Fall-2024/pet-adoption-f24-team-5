package petadoption.api;

import io.milvus.v2.client.MilvusClientV2;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import petadoption.api.milvus.MilvusService;
import petadoption.api.milvus.MilvusServiceAdapter;

@Configuration
public class GlobalMockConfig {
    @Bean(name = "mockMilvusClient")
    @Primary
    public MilvusClientV2 mockMilvusClient() {
        return Mockito.mock(MilvusClientV2.class);
    }

    @Bean(name = "mockMilvusService")
    @Primary
    public MilvusService mockMilvusService(@Qualifier("mockMilvusClient") MilvusClientV2 milvusClient) {
        return Mockito.mock(MilvusService.class);
    }

    @Bean(name = "mockMilvusServiceAdapter")
    @Primary
    public MilvusServiceAdapter mockMilvusServiceAdapter(@Qualifier("mockMilvusService") MilvusService milvusService) {
        return Mockito.mock(MilvusServiceAdapter.class);
    }


}
