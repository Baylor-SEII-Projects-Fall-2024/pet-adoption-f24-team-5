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

    @Column(name = "UNREAD_MESSAGE_CENTER")
    protected int unreadMessagesCenter;

    @Column(name = "UNREAD_MESSAGE_OWNER")
    protected int unreadMessagesOwner;

    public Conversation(){
        this.centerId = null;
        this.ownerId = null;
        this.unreadMessagesCenter = 0;
        this.unreadMessagesOwner = 0;
    }

    public Conversation(Long ownerId, Long centerId) {
        this.ownerId = ownerId;
        this.centerId = centerId;
        this.unreadMessagesCenter = 0;
        this.unreadMessagesOwner = 0;
    }

    public Conversation(Long conversationId, Long ownerId, Long centerId) {
        this.conversationId = conversationId;
        this.ownerId = ownerId;
        this.centerId = centerId;
        this.unreadMessagesCenter = 0;
        this.unreadMessagesOwner = 0;
    }
}
