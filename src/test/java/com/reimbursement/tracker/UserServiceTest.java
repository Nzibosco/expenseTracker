package com.reimbursement.tracker;

import com.reimbursement.tracker.models.User;
import com.reimbursement.tracker.repos.UserRepo;
import com.reimbursement.tracker.services.UserService;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

//@RunWith(PowerMockRunner.class)
//@PrepareForTest(AppDriver.class)
//@PowerMockIgnore({"org.mockito.*"})

public class UserServiceTest {
    UserService sut;

    UserRepo userRepo = mock(UserRepo.class);
    UserService userService = mock(UserService.class);
    User testUser = new User();

    @Before
    public void setUp() {
        sut = new UserService(userRepo);
        testUser.setUserId(1);
        testUser.setFname("Brandy");
        testUser.setLname("Departed");
        testUser.setUsername("bdep");
        testUser.setPassword("brandypass");
        testUser.setRoleId(1);
    }

    @After
    public void tearDown() {
        sut = null;
    }

    @Test
    public void testIsValidMethodToConfirmIfTheUserMeetsTheMinimumRequirements() {
        when(userService.isUserValid(testUser)).thenReturn(true);
        sut.isUserValid(testUser);
    }

//    @Test(expected = ResourceNotFoundException.class)
//    public void testFindAllUsersMethodWhenUserSetReturnedIsEmpty() {
//        when(userService.register(testUser)).thenThrow(ResourceNotFoundException.class);
//        sut.findAllUsers("Admin");
//    }

//    @Test(expected = AuthorizationException.class)
//    public void testFindAllUsersMethodWhenCurrentUserRoleIsNotAdmin() {
//        mockStatic(AppDriver.class);
//        //when(AppDriver.currentUser == null).thenReturn(false);
//        when(userService.findAllUsers("Customer")).thenThrow(AuthorizationException.class);
//        sut.findAllUsers("Customer");
//    }
}
