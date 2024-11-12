package petadoption.api.recommendationEngine;

import lombok.Getter;
import lombok.Setter;
import org.deeplearning4j.models.word2vec.Word2Vec;
import org.deeplearning4j.text.sentenceiterator.CollectionSentenceIterator;
import org.deeplearning4j.text.sentenceiterator.SentenceIterator;
import org.deeplearning4j.text.tokenization.tokenizerfactory.DefaultTokenizerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;
import petadoption.api.recommendationEngine.AttributeIterator;

import java.util.ArrayList;
import java.util.List;

@Service
@Getter
@Setter
public class AttributeEmbedding {

    private Word2Vec word2Vec;
    private final List<String> additionalSentences = new ArrayList<>(); // Stores new words/sentences for retraining

    @Bean
    public Word2Vec word2Vec() {
        // Initialize the initial Word2Vec model
        if (word2Vec == null) {
            word2Vec = trainAttributeEmbeddings(new AttributeIterator().getSentenceIterator());
        }
        return word2Vec;
    }

    public Word2Vec trainAttributeEmbeddings(SentenceIterator sentenceIterator) {
        // Configure and train Word2Vec
        Word2Vec vec = new Word2Vec.Builder()
                .minWordFrequency(1)
                .layerSize(50)
                .windowSize(5)
                .learningRate(0.025)
                .seed(42)
                .iterate(sentenceIterator)
                .tokenizerFactory(new DefaultTokenizerFactory())
                .build();

        // Train the Word2Vec model
        vec.fit();
        return vec;
    }

    public void addNewSentences(List<String> newSentences) {
        additionalSentences.addAll(newSentences);
    }

    public void retrainModel() {
        // Combine original and additional sentences
        List<String> combinedSentences = new AttributeIterator().getAllSentences();
        combinedSentences.addAll(additionalSentences);

        // Retrain Word2Vec with the combined sentences
        SentenceIterator sentenceIterator = new CollectionSentenceIterator(combinedSentences);
        word2Vec = trainAttributeEmbeddings(sentenceIterator);
        additionalSentences.clear(); // Clear after retraining
    }
}
