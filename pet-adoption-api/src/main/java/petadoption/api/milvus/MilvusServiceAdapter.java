package petadoption.api.milvus;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import io.milvus.v2.service.vector.request.data.BaseVector;
import io.milvus.v2.service.vector.request.data.FloatVec;
import io.milvus.v2.service.vector.response.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MilvusServiceAdapter {

    private final MilvusService milvusService;
    private final static String collectionName = "preference_weight_collection";

    public UpsertResp upsertData(long id, double [] vector, int dim, String partitionName) {

        try {
            if (!milvusService.collectionExists(collectionName)) {
                milvusService.createCollection(collectionName, dim);
            }

            if (!milvusService.partitionExists(collectionName, partitionName)) {
                milvusService.createPartition(collectionName, partitionName);
            }

            JsonObject jsonObject = new JsonObject();
            jsonObject.addProperty(milvusService.idName, id);

            JsonArray vectorArray = new JsonArray();
            for (double v : vector) {
                vectorArray.add(v);
            }
            jsonObject.add(milvusService.vectorField, vectorArray);

            List<JsonObject> data = Arrays.asList(jsonObject);

            return milvusService.upsertData(data, collectionName, partitionName);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    public DeleteResp deleteData(long id, String partitionName) {
        try {
            return milvusService.deleteDataById(id, collectionName, partitionName);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public double[] getData(long id, String partitionName) {
        try {
            GetResp resp = milvusService.getDataById(id, collectionName, partitionName);
            if(resp == null) {
                return null;
            } else {
                return this.parseGetRespForVector(resp);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public List<Long> findKthNearest(double[] queryArray, int k, String partitionName) {
        try {
            float[] floatArray = new float[queryArray.length];
            for (int i = 0; i < queryArray.length; i++) {
                floatArray[i] = (float) queryArray[i];
            }

            FloatVec floatVec = new FloatVec(floatArray);

            List<BaseVector> queryVec = Arrays.asList(floatVec);

            return this.parseSearchRespForId(milvusService.findKthNearest(queryVec, k, collectionName, partitionName));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private double[] parseGetRespForVector(GetResp getResp) {
        QueryResp.QueryResult result = getResp.getGetResults().getFirst();

        List<Float> floatVec = (List<Float>)result.getEntity().get(milvusService.vectorField);

        return floatVec.stream().mapToDouble(x -> x).toArray();

    }

    private List<Long> parseSearchRespForId(SearchResp searchResp) {
        List<List<SearchResp.SearchResult>> result = searchResp.getSearchResults();
        List<Long> ids = new ArrayList<>();

        for(List<SearchResp.SearchResult> searchResult : result){
           for(SearchResp.SearchResult sr : searchResult){
               ids.add((long)sr.getId());
           }
        }

        return ids;
    }
}