package petadoption.api.conversation.conversation;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
@Entity
@Table(name = Conversation.TABLE_NAME)
public class Conversation {
    public static final String TABLE_NAME = "CONVERSATIONS";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "CONVERSATION_ID")
    protected Long conversationId;

    @Column(name = "OWNER_ID")
    protected Long ownerId;

    @Column(name = "CENTER_ID")
    protected Long centerId;

    public Conversation(){
        this.centerId = null;
        this.ownerId = null;
    }

    public Conversation(Long ownerId, Long centerId) {
        this.ownerId = ownerId;
        this.centerId = centerId;
    }

    public Conversation(Long conversationId, Long ownerId, Long centerId) {
        this.conversationId = conversationId;
        this.ownerId = ownerId;
        this.centerId = centerId;
    }
}
