package tizianosanseverino.PostHub.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tizianosanseverino.PostHub.entities.Role;
import tizianosanseverino.PostHub.exceptions.NotFoundException;
import tizianosanseverino.PostHub.repositories.UserRolesRepository;

@Service
public class UserRolesService {
    @Autowired
    private UserRolesRepository roleRepository;

    public Role findByName(String name) {
        return roleRepository.findByName(name)
                .orElseThrow(() -> new NotFoundException("Role not found: " + name));
    }

    public Role save(Role role) {
        return roleRepository.save(role);
    }
}
