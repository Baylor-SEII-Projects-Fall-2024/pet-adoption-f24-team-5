package petadoption.api.images;

import io.milvus.v2.client.MilvusClientV2;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import petadoption.api.PetAdoptionApplicationTests;
import petadoption.api.milvus.MilvusService;
import petadoption.api.milvus.MilvusServiceAdapter;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

//@SpringBootTest
//@ActiveProfiles("testdb")
@Transactional
public class ImageTests extends PetAdoptionApplicationTests {


    @Autowired
    private ImageService imageService;

    @BeforeAll
    public static void setUpBeforeClass() {
        Path directory = Paths.get("src/test/resources/images/");
        try {
            if(!Files.exists(directory)) {
                Files.createDirectories(directory);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @AfterAll
    public static void tearDown() {
        Path directory = Paths.get("src/test/resources/images/");
        try {
            if (Files.exists(directory) && Files.isDirectory(directory)) {
                Files.walk(directory)
                        .sorted((path1, path2) -> path2.compareTo(path1))
                        .forEach(path -> {
                            try {
                                Files.delete(path);
                            } catch (IOException e) {
                                System.err.println("Failed to delete " + path + ": " + e.getMessage());
                            }
                        });
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Test
    @DisplayName("save image success")
    void testSaveImageSuccess() {
        MockMultipartFile mockImage = new MockMultipartFile("file", "test.jpg", "image/jpeg", "test".getBytes());

        final String[] result = new String[1];

        assertDoesNotThrow(() -> {
            result[0] = imageService.saveImage(mockImage);
        });

        assert(result[0].contains("test.jpg"));
    }

    @Test
    @DisplayName("save image empty")
    void testSaveImageEmptyFile() {
        MockMultipartFile mockImage = new MockMultipartFile("file", "test.jpg", "image/jpeg", new byte[0]);

        assertThrows(IllegalArgumentException.class, () -> {
            imageService.saveImage(mockImage);
            imageService.saveImage(null);
        });
    }

    @Test
    @DisplayName("test get image")
    void testGetImageSuccess() {
        MockMultipartFile mockImage = new MockMultipartFile("file", "test.jpg", "image/jpeg", "test".getBytes());
        final String[] result = new String[1];
        assertDoesNotThrow(() -> {
            result[0] = imageService.saveImage(mockImage);
        });

        final Map<String, String> getResult = new HashMap<>();
        assertDoesNotThrow(() -> {
            Map.Entry<String, String> entry = imageService.getImage(result[0]);

            getResult.put(entry.getKey(), entry.getValue());
        });

        String type = getResult.keySet().iterator().next();
        String data = getResult.get(type);

        assertEquals(type, "image/jpeg");
        assertNotNull(data);
    }

    @Test
    @DisplayName("get image bad file name")
    void testGetImageBadFileName() {
        MockMultipartFile mockImage = new MockMultipartFile("file", "test.jpg", "image/jpeg", "test".getBytes());
        assertDoesNotThrow(() -> {
            imageService.saveImage(mockImage);
        });

        assertThrows(IOException.class, () -> {
            Map.Entry<String, String> entry = imageService.getImage("this is a bad image name");
        });
    }

    @Test
    @DisplayName("delete image success")
    void testDeleteImageSuccess() {
        assertDoesNotThrow(() -> {
            MockMultipartFile mockImage = new MockMultipartFile("file", "test.jpg", "image/jpeg", "test".getBytes());
            final String[] result = new String[1];
            assertDoesNotThrow(() -> {
                result[0] = imageService.saveImage(mockImage);
            });

            assertTrue(imageService.deleteImage(result[0]));
        });
    }

    @Test
    @DisplayName("delete image bad file name")
    void testDeleteImageBadFileName() {
        assertThrows(IllegalArgumentException.class, () -> {
            MockMultipartFile mockImage = new MockMultipartFile("file", "test.jpg", "image/jpeg", "test".getBytes());
            assertDoesNotThrow(() -> {
                imageService.saveImage(mockImage);
            });

            assertFalse(imageService.deleteImage(null));
        });
    }
}
