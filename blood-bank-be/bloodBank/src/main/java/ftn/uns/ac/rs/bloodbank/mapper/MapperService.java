package ftn.uns.ac.rs.bloodbank.mapper;

import ftn.uns.ac.rs.bloodbank.center.Center;
import ftn.uns.ac.rs.bloodbank.center.CenterDto;
import ftn.uns.ac.rs.bloodbank.center.CenterDtoResponse;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.stereotype.Component;

@Component
public class MapperService {
    private final ModelMapper modelMapper;

    public MapperService(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
        this.modelMapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.LOOSE);
    }
    public CenterDtoResponse CenterToCenterDto(Center center){
        return modelMapper.map(center,CenterDtoResponse.class);
    }
    public Center CenterDtoToCenter(CenterDto centerDto){
        return modelMapper.map(centerDto,Center.class);
    }

}
