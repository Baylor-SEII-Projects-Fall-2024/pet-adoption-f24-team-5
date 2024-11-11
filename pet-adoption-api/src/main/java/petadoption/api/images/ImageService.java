package petadoption.api.images;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.*;

@Service
public class ImageService {

    public String saveImage(String uploadDirectory, MultipartFile imageFile) throws IOException {
        if (imageFile == null || imageFile.isEmpty() || uploadDirectory == null) {
            throw new IllegalArgumentException("File is empty");
        }
        String uniqueImageName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();

        Path uploadPath = Path.of(uploadDirectory);
        Path imagePath = uploadPath.resolve(uniqueImageName);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Files.copy(imageFile.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);

        return uniqueImageName;
    }

    public Map.Entry<String, String> getImage(String uploadDirectory, String uniqueImageName) throws IOException {

        if (uniqueImageName == null || uniqueImageName.isEmpty() || uploadDirectory == null) {
            throw new IllegalArgumentException("File or directory is null");
        }

        Path imagePath = Path.of(uploadDirectory, uniqueImageName);

        if (Files.exists(imagePath)) {
            byte[] imageBytes = Files.readAllBytes(imagePath);

            // encode string to standardize
            String encodedString = Base64.getEncoder().encodeToString(imageBytes);

            // get filetype
            String mimeType = Files.probeContentType(imagePath);

            return new AbstractMap.SimpleEntry<>(mimeType, encodedString);
        } else {
            throw new IOException("image not found");
            /// TODO return standard image for not found when that is added to resources
        }
    }

    public Boolean deleteImage(String uploadDirectory, String uniqueImageName) throws IOException {

        if (uniqueImageName == null || uniqueImageName.isEmpty() || uploadDirectory == null) {
            throw new IllegalArgumentException("File or directory is null");
        }

        Path imagePath = Path.of(uploadDirectory, uniqueImageName);

        if (Files.exists(imagePath)) {
            Files.delete(imagePath);
            return true;
        } else {
            throw new IllegalArgumentException("image not found");
        }
    }
}
