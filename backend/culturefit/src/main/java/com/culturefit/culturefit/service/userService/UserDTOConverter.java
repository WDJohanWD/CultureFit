package com.culturefit.culturefit.service.userService;

import java.time.LocalDate;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.culturefit.culturefit.domain.User;
import com.culturefit.culturefit.domain.UserDTO;

@Component
public class UserDTOConverter {


    @Autowired
    private ModelMapper modelMapper;
    
    public UserDTO UserToDto(User user) {
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
        return userDTO;
    }
    

    // Convertir el DTO recibido del front a usuario, la fecha hay que convertirla
    public User DtoToUser(UserDTO userDTO) {
        User user = new User();
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(userDTO.getPassword());
        user.setBirthDate(LocalDate.parse(userDTO.getBirthDate()));
        user.setActive(false);
        user.setImageUrl(null);
        
        return user;
    }
}
