package com.deepfakejava.facefortify.controller;

import com.deepfakejava.facefortify.service.DeepwareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class DeepwareController {

    @Autowired
    private DeepwareService deepwareService;

    @CrossOrigin(origins = "http://127.0.0.1:5500")
    @GetMapping("/deepfake-check")
    public String checkDeepfake(@RequestParam String videoUrl) {
        return deepwareService.scanVideoByUrl(videoUrl);
    }

    @CrossOrigin(origins = "http://127.0.0.1:5500")
    @GetMapping("/deepfake-report")
    public String getDeepfakeReport(@RequestParam(required = false) String reportId) {
        return deepwareService.getScanReport(null, reportId);
    }

    @CrossOrigin(origins = "http://127.0.0.1:5500")
    @PostMapping("/deepfake-upload")
    public String uploadDeepfakeVideo(@RequestParam("file") MultipartFile file) {
        return deepwareService.scanVideoByFile(file);
    }

}