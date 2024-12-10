package petadoption.api.user;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import petadoption.api.user.AdoptionCenter.CenterWorker;
import petadoption.api.user.Owner.Owner;

import java.util.Collection;
import java.util.List;

@Getter
@Setter
@Data
@Entity
@Table(name = User.TABLE_NAME)
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "USER_TYPE", discriminatorType = DiscriminatorType.STRING)
@JsonSubTypes({
        @JsonSubTypes.Type(value = CenterWorker.class, name = "CenterWorker"),
        @JsonSubTypes.Type(value = Owner.class, name = "Owner")
})
//@JsonIgnoreProperties("password")
public class User implements UserDetails {
    public static final String TABLE_NAME = "USERS";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "USER_ID")
    protected Long id;

    @Column(name = "EMAIL_ADDRESS")
    protected String emailAddress;

    @Column(name = "PASSWORD")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    protected String password;

    @Column(name = "ACCOUNT_TYPE")
    @Enumerated(EnumType.STRING)
    protected UserType userType;

    @Column(name = "PHONE_NUMBER")
    private String phoneNumber;

    public User() {
    }

    public User(String emailAddress, String password, UserType userType, String phoneNumber) {
        this.emailAddress = emailAddress;
        this.password = password;
        this.userType = userType;
        this.phoneNumber = phoneNumber;
    }

    public User(Long id, String emailAddress, String password, UserType userType, String phoneNumber) {
        this.id = id;
        this.emailAddress = emailAddress;
        this.password = password;
        this.userType = userType;
        this.phoneNumber = phoneNumber;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(userType.name()));
    }

    @Override
    public String getUsername() {
        return this.emailAddress;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }
}