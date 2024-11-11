package petadoption.api.images;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.AbstractMap;
import java.util.Map;
import java.util.Objects;

@RequestMapping("api/images")
@RestController
public class ImageController {

    private final ImageService imageService;

    @Autowired
    public ImageController(ImageService imageService) { this.imageService = imageService; }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        System.out.println(file.getOriginalFilename());
        try {
            return ResponseEntity.status(HttpStatus.OK).body(imageService.saveImage(file));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/{imageName}")
    public ResponseEntity<Map.Entry<String, String>> getImage(@PathVariable String imageName) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(imageService.getImage(imageName));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new AbstractMap.SimpleEntry<>("Error", e.getMessage()));
        }
    }

}
