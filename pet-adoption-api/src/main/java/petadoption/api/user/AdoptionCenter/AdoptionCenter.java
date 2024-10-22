package petadoption.api.user.AdoptionCenter;

import jakarta.persistence.*;
import lombok.*;
import petadoption.api.user.User;
import petadoption.api.user.UserType;

import java.io.*;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Data
@Entity
@Getter
@Setter
@DiscriminatorValue("CENTEROWNER")
@PrimaryKeyJoinColumn(name="USER_ID")
@EqualsAndHashCode(callSuper=true)
public class AdoptionCenter extends User {

    @Column(name = "CENTER_NAME")
    private String centerName;

    @Column(name = "CENTER_ADDRESS")
    private String centerAddress;

    @Column(name = "CENTER_CITY")
    private String centerCity;

    @Column(name = "CENTER_STATE")
    private String centerState;

    @Column(name = "CENTER_ZIP")
    private String centerZip;

    @Column(name = "CENTER_PET_COUNT")
    private int numberOfPets;

    @Column(name = "LONGITUDE")
    private Double longitude;

    @Column(name = "LATITUDE")
    private Double Latitude;


    public AdoptionCenter() {
    }

    public AdoptionCenter(String emailAddress, String password, UserType userType, String phoneNumber,
                          String centerName, String centerAddress, String centerCity, String centerState, String centerZip, int numberOfPets) {
        super(emailAddress, password, userType, phoneNumber);
        this.centerName = centerName;
        this.centerAddress = centerAddress;
        this.centerCity = centerCity;
        this.centerState = centerState;
        this.centerZip = centerZip;
        this.numberOfPets = numberOfPets;
        // TODO - Add here the information here to get the
        this.getLongAndLat(centerZip);
    }

    public AdoptionCenter(Long id, String emailAddress, String password, UserType userType, String phoneNumber,
                          String centerName, String centerAddress, String centerCity, String centerState, String centerZip, int numberOfPets) {
        super(id, emailAddress, password, userType, phoneNumber);
        this.id = id;
        this.centerName = centerName;
        this.centerAddress = centerAddress;
        this.centerCity = centerCity;
        this.centerState = centerState;
        this.centerZip = centerZip;
        this.numberOfPets = numberOfPets;
        this.getLongAndLat(centerZip);
    }

    private void getLongAndLat(String centerZip) {
        try {
            // Define the relative path from the current class location to src/main/resources/zipCSV/uszips.csv
            Path csvFilePath = Paths.get("src", "main", "resources", "zipCSV", "uszips.csv").toAbsolutePath();
            File csvFile = csvFilePath.toFile();

            // Check if the file exists
            if (!csvFile.exists()) {
                System.err.println("uszips.csv file not found at " + csvFilePath);
                return;
            }

            // Read the CSV file using BufferedReader
            try (BufferedReader br = new BufferedReader(new FileReader(csvFile))) {
                List<String> lines = new ArrayList<>();
                String line;

                // Read all lines from the CSV file
                boolean firstLine = true;
                while ((line = br.readLine()) != null) {
                    // Skip header line if present
                    if (firstLine && line.startsWith("zip")) {
                        firstLine = false;
                        continue;
                    }
                    firstLine = false;
                    lines.add(line);
                }

                // Extract ZIP codes into an array for binary search
                int n = lines.size();
                String[] zipCodes = new String[n];
                for (int i = 0; i < n; i++) {
                    String[] tokens = lines.get(i).split(",", 4); // Limit split to 4 parts
                    zipCodes[i] = tokens[0].replace("\"", "").trim(); // Clean ZIP code by removing quotes and trimming whitespace
                }

                // Perform binary search to find the ZIP code
                int index = Arrays.binarySearch(zipCodes, centerZip);

                if (index >= 0) {
                    // ZIP code found, extract longitude and latitude
                    String[] tokens = lines.get(index).split(",", 4);
                    this.Latitude = Double.parseDouble(tokens[1].replace("\"", "").trim());   // Latitude
                    this.longitude = Double.parseDouble(tokens[2].replace("\"", "").trim()); // Longitude
                } else {
                    System.err.println("ZIP code " + centerZip + " not found in uszips.csv");
                }

            } catch (IOException | NumberFormatException e) {
                e.printStackTrace();
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}



