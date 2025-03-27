package com.culturefit.culturefit.services.profileImageService;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

public interface ProfileImageService {
    String saveImage(Long userId, MultipartFile file, String userName) throws IOException;
    String getExtension(String fileName);
}
