package petadoption.api.images;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;

@RequestMapping("api/images")
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ImageController {

    public static final String UPLOAD_DIRECTORY = "src/main/resources/images/";

    private final ImageService imageService;

    @Autowired
    public ImageController(ImageService imageService) { this.imageService = imageService; }

    @PostMapping("/upload")
    public String uploadImage(@RequestParam("file") MultipartFile file) throws IOException, FileNotFoundException {
        return imageService.saveImage(UPLOAD_DIRECTORY, file);
    }

    @GetMapping("/{imageName}")
    public byte[] getImage(@PathVariable String imageName) throws IOException {
        return imageService.getImage(UPLOAD_DIRECTORY, imageName);
    }

}
