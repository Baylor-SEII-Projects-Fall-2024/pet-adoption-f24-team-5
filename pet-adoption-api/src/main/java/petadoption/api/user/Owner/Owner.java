package petadoption.api.user.Owner;


import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;
import petadoption.api.pet.Pet;
import petadoption.api.preferences.Preference;
import petadoption.api.preferences.PreferenceWeights;
import petadoption.api.user.User;
import petadoption.api.user.UserType;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Getter
@Setter
@Entity
@DiscriminatorValue("OWNER")
@PrimaryKeyJoinColumn(name = "USER_ID")
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
public class Owner extends User {

    @OneToOne
    @JoinColumn(name = "PREFERENCE_WEIGHTS_ID")
    private PreferenceWeights preferenceWeights;

    @OneToOne
    @JoinColumn(name = "DEFAULT_PREFERENCE_ID")
    private Preference defaultPreference;

    @Column(name = "AGE")
    private int age;

    @Column(name = "LONGITUDE")
    private Double longitude;

    @Column(name = "ZIPCODE")
    private String centerZip;

    @Column(name = "LATITUDE")
    private Double Latitude;

    @Column(name = "FIRST_NAME")
    protected String firstName;

    @Column(name = "LAST_NAME")
    protected String lastName;


    @ElementCollection
    @CollectionTable(name = "saved_pets", joinColumns = @JoinColumn(name = "owner_id"))
    @Column(name = "pet_id")
    private Set<Long> savedPets = new HashSet<>();



    public Owner(String firstName, String lastName, String emailAddress, String password, UserType userType, int age,
            String phoneNumber, String centerZip) {
        super(emailAddress, password, userType, phoneNumber);
        this.age = age;
        this.firstName = firstName;
        this.lastName = lastName;
        this.centerZip = centerZip;
        getLongAndLat(centerZip);
    }

    public Owner(String emailAddress, String password, UserType userType, int age, String phoneNumber,
                 PreferenceWeights preferenceWeights, String centerZip) {
        super(emailAddress, password, userType, phoneNumber);
        this.preferenceWeights = preferenceWeights;
        this.age = age;
        this.firstName = firstName;
        this.lastName = lastName;
        this.centerZip = centerZip;
        getLongAndLat(centerZip);
    }

    public Owner(Long id, String firstName, String lastName, String emailAddress, String password, UserType userType,
                 int age, String phoneNumber, PreferenceWeights preferenceWeights, String centerZip) {
        super(id, emailAddress, password, userType, phoneNumber);
        this.preferenceWeights = preferenceWeights;
        this.age = age;
        this.firstName = firstName;
        this.lastName = lastName;
        this.centerZip = centerZip;
        getLongAndLat(centerZip);
    }

    public void getLongAndLat(String centerZip) {
        try {
            // Define the relative path from the current class location to
            // src/main/resources/zipCSV/uszips.csv
            Path csvFilePath = Paths.get("resources", "zipCSV", "uszips.csv").toAbsolutePath();
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
                    zipCodes[i] = tokens[0].replace("\"", "").trim(); // Clean ZIP code by removing quotes and trimming
                                                                      // whitespace
                }

                // Perform binary search to find the ZIP code
                int index = Arrays.binarySearch(zipCodes, centerZip);

                if (index >= 0) {
                    // ZIP code found, extract longitude and latitude
                    String[] tokens = lines.get(index).split(",", 4);
                    this.Latitude = Double.parseDouble(tokens[1].replace("\"", "").trim()); // Latitude
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

    public void setPreferenceId(Long preferenceId) {
        this.preferenceWeights.setPreferenceWeightId(preferenceId);
    }


}
