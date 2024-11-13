package petadoption.api.conversation.message;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.checkerframework.checker.units.qual.C;

import java.time.LocalDateTime;

@Getter
@Setter
@Data
@Entity
@Table(name = Message.TABLE_NAME)
public class Message {
    public static final String TABLE_NAME = "MESSAGES";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "MESSAGE_ID")
    protected Long messageId;

    @Column(name = "CONVERSATION_ID")
    protected Long conversationId;

    @Column(name = "SENDER_ID")
    protected Long senderId;

    @Column(name = "RECEIVER_ID")
    protected Long receiverId;

    @Column(name = "MESSAGE")
    protected String message;

    @Column(name = "DATE")
    protected LocalDateTime date;

    @Column(name = "IS_READ")
    protected Boolean isRead;

    public Message() {
        this.conversationId = null;
        this.senderId = null;
        this.receiverId = null;
        this.message = null;
        this.date = null;
        this.isRead = null;
    }

    public Message(Long conversationId, Long senderId, Long receiverId, String message) {
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.message = message;
        this.date = LocalDateTime.now();
        this.isRead = false;
    }

    public Message(Long messageId, Long conversationId, Long senderId, Long receiverId, String message) {
        this.messageId = messageId;
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.message = message;
        this.date = LocalDateTime.now();
        this.isRead = false;
    }

}
