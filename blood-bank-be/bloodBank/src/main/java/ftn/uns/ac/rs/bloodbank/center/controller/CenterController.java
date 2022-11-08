package ftn.uns.ac.rs.bloodbank.center.controller;

import com.sun.istack.NotNull;
import ftn.uns.ac.rs.bloodbank.center.service.CenterService;
import ftn.uns.ac.rs.bloodbank.center.dto.CenterDto;
import ftn.uns.ac.rs.bloodbank.center.dto.CenterDtoResponse;
import ftn.uns.ac.rs.bloodbank.center.dto.CenterDtoUpdate;
import ftn.uns.ac.rs.bloodbank.mapper.MapperService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "api/v1/center")
public class CenterController {
    private final CenterService centerService;
    private final MapperService mapperService;

    public CenterController(CenterService centerService, MapperService mapperService) {
        this.centerService = centerService;
        this.mapperService = mapperService;
    }

    @GetMapping()
    public ResponseEntity<List<CenterDtoResponse>> getAllCenters(){
        var centers = centerService.getAllCenters()
                .stream()
                .map(mapperService::CenterToCenterDto)
                .toList();
        return ResponseEntity.ok(centers);
    }
    @PostMapping
    public void createCenter(@RequestBody CenterDto centerDto){
        var center = mapperService.CenterDtoToCenter(centerDto);
        centerService.createCenter(center);
    }
    @GetMapping(path = "{id}")
    public ResponseEntity<CenterDtoResponse> getCenter(@NotNull @PathVariable("id") UUID id) {
        var center =mapperService
                .CenterToCenterDto(centerService.getCenter(id));
        return ResponseEntity.ok(center);
    }
    @PutMapping()
    public ResponseEntity<String> updateCenter(@RequestBody CenterDtoUpdate centerDto){
        var center = mapperService.CenterDtoUpdateToCenter(centerDto);
        centerService.updateCenter(center);
        return ResponseEntity.noContent().build();
    }
}