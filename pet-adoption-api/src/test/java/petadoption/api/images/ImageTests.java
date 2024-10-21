package petadoption.api.images;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("testdb")
@Transactional
public class ImageTests {

    final private String UPLOAD_DIRECTORY = "src/test/resources/images/";

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
            result[0] = imageService.saveImage(UPLOAD_DIRECTORY, mockImage);
        });

        assert(result[0].contains("test.jpg"));
    }

    @Test
    @DisplayName("save image empty")
    void testSaveImageEmptyFile() {
        MockMultipartFile mockImage = new MockMultipartFile("file", "test.jpg", "image/jpeg", new byte[0]);

        assertThrows(IllegalArgumentException.class, () -> {
            imageService.saveImage(UPLOAD_DIRECTORY, mockImage);
            imageService.saveImage(UPLOAD_DIRECTORY, null);
        });
    }

    @Test
    @DisplayName("test bad upload directory")
    void testBadUploadDirectory() {
        MockMultipartFile mockImage = new MockMultipartFile("file", "test.jpg", "image/jpeg", "test".getBytes());
        assertThrows(IllegalArgumentException.class, () -> {
            imageService.saveImage(UPLOAD_DIRECTORY + "asdf", mockImage);
        });
    }

    @Test
    @DisplayName("test get image")
    void testGetImageSuccess() {
        MockMultipartFile mockImage = new MockMultipartFile("file", "test.jpg", "image/jpeg", "test".getBytes());
        final String[] result = new String[1];
        assertDoesNotThrow(() -> {
            result[0] = imageService.saveImage(UPLOAD_DIRECTORY, mockImage);
        });

        final Map<String, String> getResult = new HashMap<>();
        assertDoesNotThrow(() -> {
            Map.Entry<String, String> entry = imageService.getImage(UPLOAD_DIRECTORY, result[0]);

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
            imageService.saveImage(UPLOAD_DIRECTORY, mockImage);
        });

        assertThrows(IOException.class, () -> {
            Map.Entry<String, String> entry = imageService.getImage(UPLOAD_DIRECTORY, "this is a bad image name");
        });
    }

    @Test
    @DisplayName("get image bad directory")
    void testGetImageBadDirectory() {
        assertThrows(IOException.class, () -> {
            MockMultipartFile mockImage = new MockMultipartFile("file", "test.jpg", "image/jpeg", "test".getBytes());
            final String[] result = new String[1];
            assertDoesNotThrow(() -> {
                result[0] = imageService.saveImage(UPLOAD_DIRECTORY, mockImage);
            });

            Map.Entry<String, String> entry = imageService.getImage(UPLOAD_DIRECTORY + "bad directory", result[0]);
        });
    }

    @Test
    @DisplayName("delete image success")
    void testDeleteImageSuccess() {
        assertDoesNotThrow(() -> {
            MockMultipartFile mockImage = new MockMultipartFile("file", "test.jpg", "image/jpeg", "test".getBytes());
            final String[] result = new String[1];
            assertDoesNotThrow(() -> {
                result[0] = imageService.saveImage(UPLOAD_DIRECTORY, mockImage);
            });

            assertTrue(imageService.deleteImage(UPLOAD_DIRECTORY, result[0]));
        });
    }

    @Test
    @DisplayName("delete image bad directory name")
    void testDeleteImageBadDirectoryName() {
        assertThrows(IllegalArgumentException.class, () -> {
            MockMultipartFile mockImage = new MockMultipartFile("file", "test.jpg", "image/jpeg", "test".getBytes());
            final String[] result = new String[1];
            assertDoesNotThrow(() -> {
                result[0] = imageService.saveImage(UPLOAD_DIRECTORY, mockImage);
            });

            assertFalse(imageService.deleteImage(UPLOAD_DIRECTORY + "bad directory", result[0]));
        });
    }

    @Test
    @DisplayName("delete image bad file name")
    void testDeleteImageBadFileName() {
        assertThrows(IllegalArgumentException.class, () -> {
            MockMultipartFile mockImage = new MockMultipartFile("file", "test.jpg", "image/jpeg", "test".getBytes());
            assertDoesNotThrow(() -> {
                imageService.saveImage(UPLOAD_DIRECTORY, mockImage);
            });

            assertFalse(imageService.deleteImage(UPLOAD_DIRECTORY, null));
        });
    }
}
