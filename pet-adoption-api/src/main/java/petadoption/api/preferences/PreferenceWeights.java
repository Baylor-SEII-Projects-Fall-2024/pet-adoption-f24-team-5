/*
package petadoption.api.preferences;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = PreferenceWeights.TABLE_NAME)
@NoArgsConstructor
@AllArgsConstructor
public class PreferenceWeights {
    public static final String TABLE_NAME = "PREFERENCE_WEIGHTS";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "PREFERENCE_WEIGHTS_ID")
    private Long preferenceWeightId;

    @Column(name = "COLD-START-VALUE", columnDefinition = "int default 3")
    private int coldStartValue;

    @Column(name = "WEIGHT-1")
    private Double weight1;

    @Column(name = "WEIGHT-2")
    private Double weight2;

    @Column(name = "WEIGHT-3")
    private Double weight3;

    @Column(name = "WEIGHT-4")
    private Double weight4;

    @Column(name = "WEIGHT-5")
    private Double weight5;

    @Column(name = "WEIGHT-6")
    private Double weight6;

    @Column(name = "WEIGHT-7")
    private Double weight7;

    @Column(name = "WEIGHT-8")
    private Double weight8;

    @Column(name = "WEIGHT-9")
    private Double weight9;

    @Column(name = "WEIGHT-10")
    private Double weight10;

    @Column(name = "WEIGHT-11")
    private Double weight11;

    @Column(name = "WEIGHT-12")
    private Double weight12;

    @Column(name = "WEIGHT-13")
    private Double weight13;

    @Column(name = "WEIGHT-14")
    private Double weight14;

    @Column(name = "WEIGHT-15")
    private Double weight15;

    @Column(name = "WEIGHT-16")
    private Double weight16;

    @Column(name = "WEIGHT-17")
    private Double weight17;

    @Column(name = "WEIGHT-18")
    private Double weight18;

    @Column(name = "WEIGHT-19")
    private Double weight19;

    @Column(name = "WEIGHT-20")
    private Double weight20;

    @Column(name = "WEIGHT-21")
    private Double weight21;

    @Column(name = "WEIGHT-22")
    private Double weight22;

    @Column(name = "WEIGHT-23")
    private Double weight23;

    @Column(name = "WEIGHT-24")
    private Double weight24;

    @Column(name = "WEIGHT-25")
    private Double weight25;

    @Column(name = "WEIGHT-26")
    private Double weight26;

    @Column(name = "WEIGHT-27")
    private Double weight27;

    @Column(name = "WEIGHT-28")
    private Double weight28;

    @Column(name = "WEIGHT-29")
    private Double weight29;

    @Column(name = "WEIGHT-30")
    private Double weight30;

    @Column(name = "WEIGHT-31")
    private Double weight31;

    @Column(name = "WEIGHT-32")
    private Double weight32;

    @Column(name = "WEIGHT-33")
    private Double weight33;

    @Column(name = "WEIGHT-34")
    private Double weight34;

    @Column(name = "WEIGHT-35")
    private Double weight35;

    @Column(name = "WEIGHT-36")
    private Double weight36;

    @Column(name = "WEIGHT-37")
    private Double weight37;

    @Column(name = "WEIGHT-38")
    private Double weight38;

    @Column(name = "WEIGHT-39")
    private Double weight39;

    @Column(name = "WEIGHT-40")
    private Double weight40;

    @Column(name = "WEIGHT-41")
    private Double weight41;

    @Column(name = "WEIGHT-42")
    private Double weight42;

    @Column(name = "WEIGHT-43")
    private Double weight43;

    @Column(name = "WEIGHT-44")
    private Double weight44;

    @Column(name = "WEIGHT-45")
    private Double weight45;

    @Column(name = "WEIGHT-46")
    private Double weight46;

    @Column(name = "WEIGHT-47")
    private Double weight47;

    @Column(name = "WEIGHT-48")
    private Double weight48;

    @Column(name = "WEIGHT-49")
    private Double weight49;

    @Column(name = "WEIGHT-50")
    private Double weight50;

    public PreferenceWeights(double[] weights){
        weight1 = weights[0];
        weight2 = weights[1];
        weight3 = weights[2];
        weight4 = weights[3];
        weight5 = weights[4];
        weight6 = weights[5];
        weight7 = weights[6];
        weight8 = weights[7];
        weight9 = weights[8];
        weight10 = weights[9];
        weight11 = weights[10];
        weight12 = weights[11];
        weight13 = weights[12];
        weight14 = weights[13];
        weight15 = weights[14];
        weight16 = weights[15];
        weight17 = weights[16];
        weight18 = weights[17];
        weight19 = weights[18];
        weight20 = weights[19];
        weight21 = weights[20];
        weight22 = weights[21];
        weight23 = weights[22];
        weight24 = weights[23];
        weight25 = weights[24];
        weight26 = weights[25];
        weight27 = weights[26];
        weight28 = weights[27];
        weight29 = weights[28];
        weight30 = weights[29];
        weight31 = weights[30];
        weight32 = weights[31];
        weight33 = weights[32];
        weight34 = weights[33];
        weight35 = weights[34];
        weight36 = weights[35];
        weight37 = weights[36];
        weight38 = weights[37];
        weight39 = weights[38];
        weight40 = weights[39];
        weight41 = weights[40];
        weight42 = weights[41];
        weight43 = weights[42];
        weight44 = weights[43];
        weight45 = weights[44];
        weight46 = weights[45];
        weight47 = weights[46];
        weight48 = weights[47];
        weight49 = weights[48];
        weight50 = weights[49];

    }

    public double[] getAllWeights(){
        double[] weights = {
                weight1,
                weight2,
                weight3,
                weight4,
                weight5,
                weight6,
                weight7,
                weight8,
                weight9,
                weight10,
                weight11,
                weight12,
                weight13,
                weight14,
                weight15,
                weight16,
                weight17,
                weight18,
                weight19,
                weight20,
                weight21,
                weight22,
                weight23,
                weight24,
                weight25,
                weight26,
                weight27,
                weight28,
                weight29,
                weight30,
                weight31,
                weight32,
                weight33,
                weight34,
                weight35,
                weight36,
                weight37,
                weight38,
                weight39,
                weight40,
                weight41,
                weight42,
                weight43,
                weight44,
                weight45,
                weight46,
                weight47,
                weight48,
                weight49,
                weight50
        };
        return weights;
    }
    public Long getPreferenceWeightId() {
        return preferenceWeightId;
    }
    public void setPreferenceWeightId(Long preferenceWeightId) {
        this.preferenceWeightId = preferenceWeightId;
    }

    public int getColdStartValue() {
        return coldStartValue;
    }
}
*/
