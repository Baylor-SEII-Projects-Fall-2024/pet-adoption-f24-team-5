
package petadoption.api.recommendationEngine;

import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.service.vector.response.UpsertResp;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import petadoption.api.milvus.MilvusService;
import petadoption.api.milvus.MilvusServiceAdapter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Controller
@RequiredArgsConstructor
@ConditionalOnBean({MilvusService.class, MilvusServiceAdapter.class})
public class MockMilvusController {

    private final MilvusServiceAdapter milvusServiceAdapter;
    private final MilvusService milvusService;

    private final int DIMENSIONS = 100;
    private final int vectorCt = 1050;
    public final String PET_PARTITION = "PET_PARTITION";


    @PostMapping("api/milvus/save")
    public ResponseEntity<?> saveMilvus(){
        List<double[]> vectors = new ArrayList<>();
        Random random = new Random();
        for (int i = 0; i < vectorCt; i++) {
            double[] vector = new double[DIMENSIONS];
            for (int j = 0; j < DIMENSIONS; j++) {
                vector[j] = random.nextDouble() * 10;
            }
            vectors.add(vector);
        }

        try {
            List<UpsertResp> resp = new ArrayList<>();
            for (int i = 0; i < vectorCt; i++) {
                resp.add(milvusServiceAdapter.upsertData(i, vectors.get(i), DIMENSIONS, PET_PARTITION));
            }

            return new ResponseEntity<>(resp, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/api/milvus/get/{id}")
    public ResponseEntity<?> getMilvusById(@PathVariable("id") long id){
        try{
            return new ResponseEntity<>(milvusServiceAdapter.getData(id, PET_PARTITION), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/api/milvus/deleteid/{id}")
    public ResponseEntity<?> deleteMilvusById(@PathVariable("id") long id){

        try {
            return new ResponseEntity<>(milvusServiceAdapter.deleteData(id, PET_PARTITION), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


    @DeleteMapping("api/milvus/delete/{name}")
    public ResponseEntity<?> dropCollection(@PathVariable("name") String name){
        try {
            milvusService.dropCollection(name);
            return new ResponseEntity<>("Drop Success", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/api/milvus/nearest/{k}")
    public ResponseEntity<?> getMilvusNearest(@PathVariable("k") int k){
        Random random = new Random();

        double[] vector = new double[DIMENSIONS];
        for (int j = 0; j < DIMENSIONS; j++) {
            vector[j] = random.nextDouble() * 10;
        }

        List<Long> petids = Arrays.asList(1L,4L,5L);


        try {
            return new ResponseEntity<>(milvusServiceAdapter.findKthNearest(vector,null,k, PET_PARTITION), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/api/milvus/getresp/{id}")
    public ResponseEntity<?> getMilvusRespById(@PathVariable("id") long id){
        try{
            return new ResponseEntity<>(milvusService.getDataById(id, "preference_weight_collection", PET_PARTITION).toString(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

