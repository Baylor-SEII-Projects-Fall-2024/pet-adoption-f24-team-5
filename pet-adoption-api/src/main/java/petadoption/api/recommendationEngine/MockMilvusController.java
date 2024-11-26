/*
package petadoption.api.recommendationEngine;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import petadoption.api.milvus.MilvusRepo;
import petadoption.api.milvus.MilvusService;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Controller
@RequiredArgsConstructor
public class MockMilvusController {

    private final MilvusRepo milvusRepo;
    private final MilvusService milvusService;

    private final int DIMENSIONS = 5;
    private final int vectorCt = 20;
    private final String collectionName = "test3";
    private final String partitionName = "pets";

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
            for (int i = 0; i < vectorCt; i++) {
                milvusService.upsertData(i, vectors.get(i), DIMENSIONS, collectionName, partitionName);
            }
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/api/milvus/get/{id}")
    public ResponseEntity<?> getMilvusById(@PathVariable("id") long id){
        try{
            return new ResponseEntity<>(milvusService.getData(id, collectionName, partitionName), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

   */
/* @DeleteMapping("/api/milvus/deleteid/{id}")
    public ResponseEntity<?> deleteMilvusById(@PathVariable("id") long id){
        String collectionName = "test2";
        String partitionName = "owners";

        try {
            return new ResponseEntity<>(milvusRepo.deleteData(id, collectionName, partitionName), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }*//*


    @DeleteMapping("api/milvus/delete/{name}")
    public ResponseEntity<?> dropCollection(@PathVariable("name") String name){
        try {
            milvusRepo.dropCollection(name);
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

        try {
            return new ResponseEntity<>(milvusService.findKthNearest(vector,k, collectionName, partitionName), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
*/
