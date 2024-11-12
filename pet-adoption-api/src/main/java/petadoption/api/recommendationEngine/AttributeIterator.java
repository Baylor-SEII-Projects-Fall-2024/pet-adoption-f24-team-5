package petadoption.api.recommendationEngine;

import org.deeplearning4j.text.sentenceiterator.CollectionSentenceIterator;
import org.deeplearning4j.text.sentenceiterator.SentenceIterator;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class AttributeIterator {
    private final List<String> userInteractions = Arrays.asList(
            //Dogs
            "dog goldenretriever 2 golden",
            "dog goldenretriever 10 brown",
            "dog labradorretriever 1 black",
            "dog germanshepherd 12 sable",
            "dog frenchbulldog 3 cream",
            "dog bulldog 8 white",
            "dog poodle 4 apricot",
            "dog beagle 2 tricolor",
            "dog rottweiler 9 blackandtan",
            "dog yorkshireterrier 3 tan",
            "dog boxer 5 fawn",
            "dog dachshund 2 chocolate",
            "dog siberianhusky 7 grayandwhite",
            "dog shihtzu 3 whiteandblack",
            "dog australianshepherd 1 bluemerle",
            "dog cavalierkingcharlesspaniel 3 ruby",
            "dog dobermanpinscher 13 black",
            "dog miniatureschnauzer 3 saltandpepper",
            "dog greatdane 2 harlequin",
            "dog shibainu 6 red",
            "dog cockerspaniel 4 buff",
            "dog bordercollie 3 blackandwhite",
            "dog maltese 1 white",
            "dog chihuahua 8 fawn",
            "dog bernesemountaindog 3 tricolor",
            "dog bassethound 10 brownandwhite",
            "dog havanese 4 black",
            "dog pembrokewelshcorgi 3 sable",
            "dog vizsla 9 rust",
            "dog weimaraner 4 gray",
            "dog newfoundland 1 black",
            "dog collie 11 sable",
            "dog westhighlandwhiteterrier 4 white",
            "dog rhodesianridgeback 7 redwheaten",
            "dog saintbernard 5 brownandwhite",
            "dog bostonterrier 1 blackandwhite",
            "dog akita 8 brindle",
            "dog alaskanmalamute 3 grayandwhite",
            "dog bullterrier 9 white",
            "dog americanstaffordshireterrier 4 blue",
            "dog australiancattledog 2 blue",
            "dog bichonfrise 4 white",
            "dog papillon 7 whiteandsable",
            "dog samoyed 5 white",
            "dog whippet 8 fawn",
            "dog englishspringerspaniel 1 liverandwhite",
            "dog irishsetter 3 chestnut",
            "dog scottishterrier 9 black",
            "dog chowchow 4 cinnamon",
            "dog pekingese 1 tan",

            // cats
            "cat domesticshorthair 1 calico",
            "cat domesticlonghair 3 tabby",
            "cat mainecoon 4 browntabby",
            "cat siamese 7 sealpoint",
            "cat persian 4 white",
            "cat ragdoll 2 bluepoint",
            "cat bengal 9 spotted",
            "cat sphynx 5 pink",
            "cat britishshorthair 3 gray",
            "cat scottishfold 2 browntabby",
            "cat abyssinian 6 ruddy",
            "cat russianblue 4 blue",
            "cat birman 1 sealpoint",
            "cat americanshorthair 5 silvertabby",
            "cat orientalshorthair 8 chocolate",
            "cat devonrex 4 cinnamon",
            "cat norwegianforestcat 11 blackandwhite",
            "cat himalayan 3 flamepoint",
            "cat turkishangora 1 white",
            "cat savannah 8 fawn",
            "cat balinese 3 lilacpoint",
            "cat tonkinese 9 mink",
            "cat bombay 4 black",
            "cat chartreux 8 bluegray",
            "cat singapura 1 beige",
            "cat manx 3 bicolor",
            "cat burmese 8 sable",
            "cat selkirkrex 3 cream",
            "cat egyptianmau 10 silverspotted",
            "cat exoticshorthair 5 tabby",
            "cat americancurl 1 blackandwhite",
            "cat turkishvan 4 redandwhite",
            "cat laperm 9 tortoiseshell",
            "cat ocicat 5 tawnyspotted",
            "cat somali 6 ruddy",
            "cat munchkin 2 tabby",
            "cat snowshoe 4 sealpointandwhite",
            "cat lykoi 9 blackroan",
            "cat japanesebobtail 4 tricolor",
            "cat havanabrown 10 chocolate",
            "cat pixiebob 5 brownspotted",
            "cat chantillytiffany 2 chocolate",
            "cat siberian 10 browntabby",
            "cat toyger 4 orangeandblack",
            "cat korat 1 blue",
            "cat tabby 8 graytabby",

            // snakes
            "snake ballpython 3 albino",
            "snake cornsnake 1 orange",
            "snake kingsnake 8 blackandwhite",
            "snake boaconstrictor 3 brown",
            "snake gartersnake 1 green",
            "snake burmesepython 12 yellow",
            "snake reticulatedpython 4 lavenderalbino",
            "snake milksnake 1 redandblack",
            "snake hognosesnake 8 sandy",
            "snake greentreepython 3 green",
            "snake carpetpython 11 jungle",
            "snake roughgreensnake 1 brightgreen",
            "snake easternindigo 8 black"

    );


    public SentenceIterator getSentenceIterator() {
        return new CollectionSentenceIterator(userInteractions);
    }

    public List<String> getAllSentences() {
        return new ArrayList<>(userInteractions);
    }
}
