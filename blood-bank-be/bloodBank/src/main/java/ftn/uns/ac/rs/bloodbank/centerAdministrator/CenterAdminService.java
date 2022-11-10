package ftn.uns.ac.rs.bloodbank.centerAdministrator;

import ftn.uns.ac.rs.bloodbank.center.model.Center;
import ftn.uns.ac.rs.bloodbank.center.repository.CenterRepository;
import ftn.uns.ac.rs.bloodbank.centerAdministrator.dto.CenterAdministratorDto;
import ftn.uns.ac.rs.bloodbank.globalExceptions.ApiNotFoundException;
import ftn.uns.ac.rs.bloodbank.mapper.MapperService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CenterAdminService {
    private final CenterAdminRepository centerAdminRepository;
    private final CenterRepository centerRepository;
    private final MapperService mapperService;
    public Center GetAdminCenter(UUID adminID){

        return centerAdminRepository.GetAdminCenter(adminID);
    }

    public CenterAdministrator getCenterAdministrator(UUID id) {
        return centerAdminRepository
                .findById(id)
                .orElseThrow(() -> new ApiNotFoundException("Center administrator with id: " + id + "does not exist"));
    }
    @Transactional
    public void createCenterAdministrator(CenterAdministratorDto centerAdministratorDto) {
        CenterAdministrator centerAdministrator = mapperService.CenterAdministratorDtoToCenterAdministrator(centerAdministratorDto);
        var center = centerRepository.findById(centerAdministratorDto.getCenter());
        center.get().addAdmin(centerAdministrator);
        centerAdminRepository.save(centerAdministrator);
        //return centerAdministrator;
    }

    @Transactional
    public void updateAdministratorCenter(UUID adminId, Center center)
    {
        var admin = getCenterAdministrator(adminId);
        admin.setCenter(center);
    }

    public List<CenterAdministrator> getAvailableAdmins(){
        return centerAdminRepository.GetAvailableAdmins();
    }

}
