/*package petadoption.api.milvus;

import com.google.gson.JsonObject;
import io.milvus.client.MilvusClient;
import io.milvus.param.MetricType;
import io.milvus.param.dml.SearchParam;
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.common.DataType;
import io.milvus.v2.common.IndexParam;
import io.milvus.v2.service.collection.request.AddFieldReq;
import io.milvus.v2.service.collection.request.CreateCollectionReq;
import io.milvus.v2.service.collection.request.DropCollectionReq;
import io.milvus.v2.service.collection.request.HasCollectionReq;
import io.milvus.v2.service.partition.request.CreatePartitionReq;
import io.milvus.v2.service.partition.request.DropPartitionReq;
import io.milvus.v2.service.partition.request.HasPartitionReq;
import io.milvus.v2.service.vector.request.DeleteReq;
import io.milvus.v2.service.vector.request.GetReq;
import io.milvus.v2.service.vector.request.SearchReq;
import io.milvus.v2.service.vector.request.UpsertReq;
import io.milvus.v2.service.vector.request.data.BaseVector;
import io.milvus.v2.service.vector.response.DeleteResp;
import io.milvus.v2.service.vector.response.GetResp;
import io.milvus.v2.service.vector.response.SearchResp;
import io.milvus.v2.service.vector.response.UpsertResp;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@ConditionalOnBean(MilvusClientV2.class)
public class MilvusService {


    final protected String idName = "id";
    final protected String vectorField = "preference_weight";


    private final MilvusClientV2 milvusClient;

    public MilvusService(MilvusClientV2 milvusClient) {
        this.milvusClient = milvusClient;
    }

    public void createCollection(String collectionName, int dimension) {
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
                .dimension(dimension)
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
                .metricType(IndexParam.MetricType.IP) //TRY IP metric. It is faster, but also finds distance between high dimensional vectors.
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

    public boolean collectionExists(String collectionName) {
        HasCollectionReq collection = HasCollectionReq.builder()
                        .collectionName(collectionName).build();

        return milvusClient.hasCollection(collection);
    }

    public void dropCollection(String collectionName) {
        DropCollectionReq collection = DropCollectionReq.builder()
                .collectionName(collectionName).build();

        try {
            milvusClient.dropCollection(collection);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public UpsertResp upsertData(List<JsonObject> data, String collectionName, String partitionName) {
        UpsertReq upsertReq = UpsertReq.builder()
                .collectionName(collectionName)
                .data(data)
                .partitionName(partitionName)
                .build();

        return milvusClient.upsert(upsertReq);
    }

    public DeleteResp deleteDataById(long id, String collectionName, String partitionName) {
        DeleteReq deleteReq = DeleteReq.builder()
                .collectionName(collectionName)
                .ids(Arrays.asList(id))
                .partitionName(partitionName)
                .build();

        return milvusClient.delete(deleteReq);
    }

    public GetResp getDataById(long id, String collectionName, String partitionName) {
        GetReq getReq = GetReq.builder()
                .collectionName(collectionName)
                .ids(Collections.singletonList(id))
                .partitionName(partitionName)
                .build();

        return milvusClient.get(getReq);
    }

    public void  createPartition(String collectionName, String partitionName) {
        CreatePartitionReq createPartitionReq = CreatePartitionReq.builder()
                .collectionName(collectionName)
                .partitionName(partitionName)
                .build();
        try {
            milvusClient.createPartition(createPartitionReq);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public boolean partitionExists(String collectionName, String partitionName) {
        HasPartitionReq partitionReq = HasPartitionReq.builder()
                .collectionName(collectionName)
                .partitionName(partitionName)
                .build();

        return milvusClient.hasPartition(partitionReq);
    }

    public void dropPartition(String collectionName, String partitionName) {
        DropPartitionReq dropPartitionReq = DropPartitionReq.builder()
                .collectionName(collectionName)
                .partitionName(partitionName)
                .build();

        try {
            milvusClient.dropPartition(dropPartitionReq);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public SearchResp findKthNearest(List<BaseVector> queryVec,List<Long> petIds, int k, String collectionName, String partitionName) {
        String filterExpression = (petIds == null || petIds.isEmpty())
                ? ""
                : String.format("id not in %s", petIds);

        SearchReq searchReq = SearchReq.builder()
                .collectionName(collectionName)
                .data(queryVec)
                .partitionNames(Arrays.asList(partitionName))
                .topK(k)
                .filter(filterExpression)
                .build();

        return milvusClient.search(searchReq);
    }

}
*/