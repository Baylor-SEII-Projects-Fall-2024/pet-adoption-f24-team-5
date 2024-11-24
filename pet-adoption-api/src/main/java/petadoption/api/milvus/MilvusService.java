package petadoption.api.milvus;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.common.DataType;
import io.milvus.v2.common.IndexParam;
import io.milvus.v2.service.collection.request.AddFieldReq;
import io.milvus.v2.service.collection.request.CreateCollectionReq;
import io.milvus.v2.service.collection.request.DropCollectionReq;
import io.milvus.v2.service.collection.request.HasCollectionReq;
import io.milvus.v2.service.vector.request.DeleteReq;
import io.milvus.v2.service.vector.request.GetReq;
import io.milvus.v2.service.vector.request.UpsertReq;
import io.milvus.v2.service.vector.response.DeleteResp;
import io.milvus.v2.service.vector.response.GetResp;
import io.milvus.v2.service.vector.response.UpsertResp;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MilvusService {

    String CLUSTER_ENDPOINT = "http://localhost:19530";
    final String idName = "id";
    final String vectorField = "preference_weight";

    private MilvusClientV2 milvusClient;


    public MilvusService() {
        ConnectConfig connectConfig = ConnectConfig.builder()
                .uri(CLUSTER_ENDPOINT).build();

        milvusClient = new MilvusClientV2(connectConfig);
    }

    public void CreateCollection(String collectionName) {
        CreateCollectionReq.CollectionSchema schema = milvusClient.createSchema();


        //below specifies the data types in the id and vector fields
        schema.addField(AddFieldReq.builder()
                .fieldName(idName)
                .dataType(DataType.Int64)
                .isPrimaryKey(true)
                .autoID(false)
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

    public UpsertResp insertData(long id, ArrayList<Float> vector, String collectionName) {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty(idName, id);

        JsonArray vectorArray = new JsonArray();
        for (Float v : vector) {
            vectorArray.add(v);
        }
        jsonObject.add(vectorField, vectorArray);

        List<JsonObject> data = Arrays.asList(jsonObject);

        UpsertReq upsertReq = UpsertReq.builder()
                .collectionName(collectionName)
                .data(data)
                .build();

        return milvusClient.upsert(upsertReq);
    }

    public DeleteResp deleteData(long id, String collectionName) {
        DeleteReq deleteReq = DeleteReq.builder()
                .collectionName(collectionName)
                .ids(Arrays.asList(id))
                .build();

        return milvusClient.delete(deleteReq);
    }

    public GetResp getData(long id, String collectionName) {
        GetReq getReq = GetReq.builder()
                .collectionName(collectionName)
                .ids(Collections.singletonList(id))
                .build();

        return milvusClient.get(getReq);
    }
}
