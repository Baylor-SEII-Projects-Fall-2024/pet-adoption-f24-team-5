package petadoption.api.images;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ImageService {

    public String saveImage (String uploadDirectory, MultipartFile imageFile) throws IOException, FileNotFoundException {
        if (imageFile == null) {
            throw new FileNotFoundException("File is null");
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

    public byte[] getImage(String uploadDirectory, String uniqueImageName) throws IOException {
        Path imagePath = Path.of(uploadDirectory, uniqueImageName);

        if(Files.exists(imagePath)) {
            return Files.readAllBytes(imagePath);
        } else {
            return null; ///TODO: handle missing images
        }
    }

    public String deleteImage(String uploadDirectory, String uniqueImageName) throws IOException {
        Path imagePath = Path.of(uploadDirectory, uniqueImageName);

        if(Files.exists(imagePath)) {
            Files.delete(imagePath);
            return "Success";
        } else {
            return "Error"; ///TODO case handle imssing image.
        }
    }
}
