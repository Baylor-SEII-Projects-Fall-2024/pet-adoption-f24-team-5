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

@Controller
@RequiredArgsConstructor
public class MockMilvusController {

    private final MilvusService milvusService;

    @PostMapping("api/milvus/save")
    public ResponseEntity<?> saveMilvus(){
        String collectionName = "test2";
        int dim = 50;
        String partitionName = "owners";

        if(!milvusService.collectionExists(collectionName)){
            milvusService.createCollection(collectionName, dim);
        }

        if(!milvusService.partitionExists(collectionName, partitionName)){
            milvusService.createPartition(collectionName, partitionName);
        }

        double[] list = {1.23, 4.56, 7.89, 10.11, 13.14, 16.17, 19.20, 22.23, 25.26, 28.29, 31.32, 34.35, 37.38, 40.41, 43.44, 46.47, 49.50, 52.53, 55.56, 58.59, 61.62, 64.65, 67.68, 70.71, 73.74, 76.77, 79.80, 82.83, 85.86, 88.89, 91.92, 94.95, 97.98, 100.01, 103.04, 106.07, 109.10, 112.13, 115.16, 118.19, 121.22, 124.25, 127.28, 130.31, 133.34, 136.37, 139.40, 142.43, 145.46, 148.49
        };

        try {
            return new ResponseEntity<>(milvusService.insertData(1l, list, collectionName, partitionName), HttpStatus.OK);
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

    }
}
