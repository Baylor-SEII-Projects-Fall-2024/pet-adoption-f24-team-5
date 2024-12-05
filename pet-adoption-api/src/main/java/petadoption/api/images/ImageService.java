package petadoption.api.images;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@Service
public class ImageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String saveImage(MultipartFile imageFile) throws IOException {
        try {
            Path path = Paths.get(uploadDir);
            if (!Files.exists(path)) {
                Files.createDirectories(path); // Create the directory if it doesn't exist
            }

            if (imageFile.isEmpty()) {
                throw new IllegalArgumentException("File is empty");
            }
            System.out.println("Uploading file: " + imageFile.getOriginalFilename() + " of size " + imageFile.getSize());
            Path filePath = path.resolve(Objects.requireNonNull(imageFile.getOriginalFilename()));

            System.out.println("Saving file to: " + filePath.toAbsolutePath());
            Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return filePath.getFileName().toString();
        } catch (IOException e) {
            return "Failed to upload file: " + e.getMessage();
        }
    }

    public Map.Entry<String, String> getImage(String uniqueImageName) throws IOException {

        if(uniqueImageName == null || uniqueImageName.isEmpty() || uploadDir == null) {
            throw new IllegalArgumentException("File or directory is null");
        }

        Path imagePath = Path.of(uploadDir, uniqueImageName);
        imagePath = Files.exists(imagePath) ? imagePath : Path.of("pet-adoption-api/src/main/resources/defaultPictures/noPicture.jpg");

        if(Files.exists(imagePath)) {
            byte[] imageBytes = Files.readAllBytes(imagePath);

            //encode string to standardize
            String encodedString = Base64.getEncoder().encodeToString(imageBytes);

            //get filetype
            String mimeType = Files.probeContentType(imagePath);

            return new AbstractMap.SimpleEntry<>(mimeType, encodedString);
        } else {
            throw new IOException("image not found");
        }
    }

    public Boolean deleteImage(String uniqueImageName) throws IOException {

        if(uniqueImageName == null || uniqueImageName.isEmpty() || uploadDir == null) {
            throw new IllegalArgumentException("File or directory is null");
        }

        Path imagePath = Path.of(uploadDir, uniqueImageName);

        if(Files.exists(imagePath)) {
            Files.delete(imagePath);
            return true;
        } else {
            throw new IllegalArgumentException("image not found");
        }
    }
}