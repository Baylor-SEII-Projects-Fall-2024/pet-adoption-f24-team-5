package petadoption.api.auth;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import petadoption.api.config.JwtService;
import petadoption.api.conversation.conversation.Conversation;
import petadoption.api.conversation.conversation.ConversationRepository;
import petadoption.api.conversation.message.Message;
import petadoption.api.conversation.message.MessageRepository;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;
import petadoption.api.user.AdoptionCenter.AdoptionCenterRepository;
import petadoption.api.user.AdoptionCenter.CenterWorker;
import petadoption.api.user.AdoptionCenter.CenterWorkerRepository;
import petadoption.api.user.Owner.Owner;
import petadoption.api.user.Owner.OwnerRepository;
import petadoption.api.user.User;
import petadoption.api.user.UserRepository;
import petadoption.api.user.UserType;

import java.util.Optional;


@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final OwnerRepository ownerRepository;
    private final CenterWorkerRepository centerWorkerRepository;
    private final AdoptionCenterRepository adoptionCenterRepository;
    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;

    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(Owner request) throws IllegalArgumentException {

        if(doesEmailExist(request.getEmailAddress())){
            throw new IllegalArgumentException("Email is already in use");
        }

        var Owner = new Owner(
                request.getFirstName(),
                request.getLastName(),
                request.getEmailAddress(),
                passwordEncoder.encode(request.getPassword()),
                UserType.Owner,
                request.getAge(),
                request.getPhoneNumber(),
                request.getCenterZip()
        );

        ownerRepository.save(Owner);
        var jwtToken = jwtService.generateToken(Owner);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse register(CenterWorker request) throws IllegalArgumentException {

        if(doesEmailExist(request.getEmailAddress())){
            throw new IllegalArgumentException("Email is already in use");
        }

        var centerWorker = new CenterWorker(
                request.getFirstName(),
                request.getLastName(),
                request.getEmailAddress(),
                passwordEncoder.encode(request.getPassword()),
                UserType.CenterWorker,
                request.getAge(),
                request.getPhoneNumber(),
                request.getCenterID()
        );

        centerWorkerRepository.save(centerWorker);
        var jwtToken = jwtService.generateToken(centerWorker);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    private boolean doesIdExist(Long id){
        Optional<Conversation> response = conversationRepository.findById(id);
        return response.isPresent();
    }

    public AuthenticationResponse createConversation(Conversation request) throws IllegalArgumentException {
        if (doesIdExist(request.getConversationId())){
            throw new IllegalArgumentException("Conversation already exists");
        }

        var conversation = new Conversation(
                request.getConversationId(),
                request.getOwnerId(),
                request.getCenterId()
        );

        conversationRepository.save(conversation);
        var jwtToken = jwtService.generateToken(conversation);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse createMessage(Message request) throws IllegalArgumentException {
        if (doesIdExist(request.getMessageId())){
            throw new IllegalArgumentException("Message already exists");
        }

        var message = new Message(
                request.getMessageId(),
                request.getConversationId(),
                request.getSenderId(),
                request.getReceiverId(),
                request.getMessage()
        );

        messageRepository.save(message);
        var jwtToken = jwtService.generateToken(message);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse register(AdoptionCenter request) throws IllegalArgumentException {
        if(doesEmailExist(request.getEmailAddress())){
            throw new IllegalArgumentException("Email is already in use");
        }

        var adoptionCenter = new AdoptionCenter(
                request.getEmailAddress(),
                passwordEncoder.encode(request.getPassword()),
                UserType.CenterOwner,
                request.getPhoneNumber(),
                request.getCenterName(),
                request.getCenterAddress(),
                request.getCenterCity(),
                request.getCenterState(),
                request.getCenterZip(),
                request.getNumberOfPets()
        );

        adoptionCenterRepository.save(adoptionCenter);
        var jwtToken = jwtService.generateToken(adoptionCenter);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }


    private boolean doesEmailExist(String email) {
        Optional<User> response = userRepository.findByEmailAddress(email);
        return response.isPresent();
    }


    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmailAddress(), request.getPassword())
        );
        var user = userRepository.findByEmailAddress(request.getEmailAddress()).orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}
