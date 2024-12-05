package petadoption.api.recommendationEngine;

import lombok.experimental.UtilityClass;

@UtilityClass
public class VectorUtils {

    public static double cosineSimilarity(double[] vectorA, double[] vectorB) {
        if (vectorA.length != vectorB.length) {
            throw new IllegalArgumentException("Vectors must be of the same length");
        }

        double dotProduct = 0.0;
        double magnitudeA = 0.0;
        double magnitudeB = 0.0;

        for (int i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
            magnitudeA += Math.pow(vectorA[i], 2);
            magnitudeB += Math.pow(vectorB[i], 2);
        }

        magnitudeA = Math.sqrt(magnitudeA);
        magnitudeB = Math.sqrt(magnitudeB);

        if (magnitudeA == 0.0 || magnitudeB == 0.0) {
            return 0.0; // Avoid division by zero
        }

        return dotProduct / (magnitudeA * magnitudeB);
    }

    public static double[] combineVectors(double[] vectorA, double weightOfA, double[] vectorB, double weightOfB) {
        if (vectorA.length != vectorB.length) {
            throw new IllegalArgumentException("Vectors must be of the same length.");
        }

        // Normalize the weights
        double weightSum = weightOfA + weightOfB;
        double normalizedWeightA = weightOfA / weightSum;
        double normalizedWeightB = weightOfB / weightSum;

        // Create a new vector to store the combined result
        double[] combinedVector = new double[vectorA.length];

        // Combine the vectors with normalized weights
        for (int i = 0; i < vectorA.length; i++) {
            combinedVector[i] = (vectorA[i] * normalizedWeightA) + (vectorB[i] * normalizedWeightB);
        }

        return combinedVector;
    }
}
