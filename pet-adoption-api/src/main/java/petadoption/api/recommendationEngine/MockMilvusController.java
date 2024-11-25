package petadoption.api.recommendationEngine;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import petadoption.api.milvus.MilvusService;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Controller
@RequiredArgsConstructor
public class MockMilvusController {

    private final MilvusService milvusService;

    @PostMapping("api/milvus/save")
    public ResponseEntity<?> saveMilvus(){
        String collectionName = "test2";
        int dim = 50;
        String partitionName = "pets";

        if(!milvusService.collectionExists(collectionName)){
            milvusService.createCollection(collectionName, dim);
        }

        if(!milvusService.partitionExists(collectionName, partitionName)){
            milvusService.createPartition(collectionName, partitionName);
        }

        List<double[]> vectors = new ArrayList<>();
        Random random = new Random();
        for (int i = 0; i < 1000000; i++) {
            double[] vector = new double[50]; // Create a 50-dimensional array
            for (int j = 0; j < 50; j++) {
                vector[j] = random.nextDouble() * 10; // Random value between 0 and 10
            }
            vectors.add(vector);
        }

        try {
            for (int i = 0; i < 1000; i++) {
                milvusService.insertData(i, vectors.get(i), collectionName, partitionName);
            }
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/api/milvus/get/{id}")
    public ResponseEntity<?> getMilvusById(@PathVariable("id") long id){
        String collectionName = "test2";
        String partitionName = "owners";

        try{
            return new ResponseEntity<>(milvusService.getData(id, collectionName, partitionName), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/api/milvus/deleteid/{id}")
    public ResponseEntity<?> deleteMilvusById(@PathVariable("id") long id){
        String collectionName = "test2";
        String partitionName = "owners";

        try {
            return new ResponseEntity<>(milvusService.deleteData(id, collectionName, partitionName), HttpStatus.OK);
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
        String collectionName = "test2";
        String partitionName = "pets";
        double[] searchVector = {
                4.5, 3.2, 7.8, 1.9, 5.6, 8.1, 2.3, 6.7, 4.8, 9.0,
                3.4, 5.7, 7.1, 2.8, 6.2, 4.9, 8.4, 1.2, 9.6, 3.3,
                7.5, 2.1, 5.8, 6.3, 8.9, 4.1, 3.6, 7.2, 2.7, 9.3,
                5.4, 1.5, 6.6, 8.8, 3.1, 4.3, 7.4, 2.9, 9.7, 5.1,
                8.5, 6.4, 3.8, 1.6, 4.7, 9.4, 2.5, 7.9, 5.3, 6.1
        };

        try {
            return new ResponseEntity<>(milvusService.findKthNearest(searchVector,k, collectionName, partitionName), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
