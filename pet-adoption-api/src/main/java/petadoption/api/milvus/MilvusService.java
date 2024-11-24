package petadoption.api.milvus;

import io.milvus.param.ConnectParam;
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.common.DataType;
import io.milvus.v2.common.IndexParam;
import io.milvus.v2.service.collection.request.AddFieldReq;
import io.milvus.v2.service.collection.request.CreateCollectionReq;
import io.milvus.v2.service.collection.request.DropCollectionReq;
import io.milvus.v2.service.collection.request.HasCollectionReq;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class MilvusService {

    String CLUSTER_ENDPOINT = "http://localhost:19530";

    private MilvusClientV2 milvusClient;


    public MilvusService() {
        ConnectConfig connectConfig = ConnectConfig.builder()
                .uri(CLUSTER_ENDPOINT).build();

        milvusClient = new MilvusClientV2(connectConfig);
    }

    public void CreateMilvusCollection(String collectionName) {
        CreateCollectionReq.CollectionSchema schema = milvusClient.createSchema();
        final String idName = "id";
        final String vectorField = "preference_weight";

        //below specifies the data types in the id and vector fields
        schema.addField(AddFieldReq.builder()
                .fieldName(idName)
                .dataType(DataType.Int64)
                .isPrimaryKey(true)
                .autoID(true)
                .build()
        );

        schema.addField(AddFieldReq.builder()
                .fieldName(vectorField)
                .dataType(DataType.FloatVector)
                .dimension(50)
                .build()
        );

        //here I am setting indexing to use cosine similarity and IV_FLAT indexing for efficient kth nearest search
        IndexParam indexParamForIdField = IndexParam.builder()
                .fieldName(idName)
                .indexType(IndexParam.IndexType.STL_SORT)
                .build();

        IndexParam indexParamForVectorField = IndexParam.builder()
                .fieldName(vectorField)
                .indexType(IndexParam.IndexType.IVF_FLAT)
                .metricType(IndexParam.MetricType.COSINE)
                .extraParams(Map.of("nlist", 1024))
                .build();

        List<IndexParam> indexParams = new ArrayList<>();
        indexParams.add(indexParamForIdField);
        indexParams.add(indexParamForVectorField);

        CreateCollectionReq collection = CreateCollectionReq.builder()
                .collectionName(collectionName)
                .collectionSchema(schema)
                .indexParams(indexParams)
                .build();
        try {
            milvusClient.createCollection(collection);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public boolean CollectionExists(String collectionName) {
        HasCollectionReq collection = HasCollectionReq.builder()
                        .collectionName(collectionName).build();

        return milvusClient.hasCollection(collection);
    }

    public void DropCollection(String collectionName) {
        DropCollectionReq collection = DropCollectionReq.builder()
                .collectionName(collectionName).build();

        try {
            milvusClient.dropCollection(collection);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
