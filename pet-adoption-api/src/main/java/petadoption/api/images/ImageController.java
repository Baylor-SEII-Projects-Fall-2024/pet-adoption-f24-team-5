package petadoption.api.images;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

<<<<<<< HEAD
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
=======
>>>>>>> main
import java.util.AbstractMap;
import java.util.Map;
import java.util.Objects;

@RequestMapping("api/images")
@RestController
public class ImageController {

    private final ImageService imageService;

    @Autowired
    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        System.out.println(file.getOriginalFilename());
<<<<<<< HEAD
=======

        // Check file size (5MB limit)
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File size exceeds the 5MB limit.");
        }

>>>>>>> main
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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AbstractMap.SimpleEntry<>("Error", e.getMessage()));
        }
    }

}
