package com.rainbow.controller;


import com.rainbow.beans.VMInstance;
import com.rainbow.beans.VMInstance3tier;
import com.rainbow.services.SDKService;
import com.rainbow.services.VStackUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.ObjectWriter;
import org.openstack4j.api.OSClient;
import org.openstack4j.model.common.Identifier;
import org.openstack4j.model.compute.FloatingIP;
import org.openstack4j.model.compute.Server;
import org.openstack4j.openstack.OSFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
public class SDKController {

    @Autowired
    private SDKService sdkService ;


    @RequestMapping(value = "/launchInstanceNewSDK", method = RequestMethod.POST)
    public @ResponseBody String launchInstanceNew(@RequestBody VMInstance vmInstance){

        OSClient.OSClientV3 os=authenticateUser();
        if(os.getToken()!=null) {
            String launchInstancestatus = sdkService.launchInstanceNew(os, vmInstance);
            return launchInstancestatus;
        }
        else
            return "User not authenticated";
    }

    @RequestMapping(value = "/launchInstanceSDK", method = RequestMethod.POST)
    public @ResponseBody String sdkauth(@RequestBody VMInstance vmInstance){

        OSClient.OSClientV3 os=authenticateUser();
        if(os.getToken()!=null) {
            String launchInstancestatus = sdkService.launchInstance(os, vmInstance);
            return launchInstancestatus;
        }
        else
            return "User not authenticated";
    }

    @RequestMapping(value = "/launch3tierAppSDK", method = RequestMethod.POST)
    public @ResponseBody String launch3tierApp(@RequestBody VMInstance3tier instance){

        List c =new ArrayList();
        c.add("CMPE-NET2");

        OSClient.OSClientV3 os=authenticateUser();
        if(os.getToken()!=null) {
            VMInstance vmInstance1 = new VMInstance( instance.getInstanceName()+"WebServer", "WEB-FLAVOUR", "APACHE",c,instance.getWebServerType() );
//            VMInstance vmInstance2 = new VMInstance( instance.getInstanceName()+"CoreServer", "MY-SMALL", "cirros", c,instance.getWebServerType());
            VMInstance vmInstance3 = new VMInstance( instance.getInstanceName()+"DBServer", "MY-SMALL", "cirros", c,instance.getDbServerType());
            String launchInstancestatus1 = sdkService.launchInstance(os, vmInstance1);
//            String launchInstancestatus2 = sdkService.launchInstance(os, vmInstance2);
            String launchInstancestatus3 = sdkService.launchInstance(os, vmInstance3);
            if(launchInstancestatus1.equals("Instance Launched") &&launchInstancestatus3.equals("Instance Launched"))
                return "Website launched successfully";
            else
                return"Something went wrong. Please try after sometime";
        }
        else
            return "User not authenticated";
    }


    @RequestMapping(value = "/getServerListSDK", method = RequestMethod.GET)
    public @ResponseBody String getserverList() {
        OSClient.OSClientV3 os = authenticateUser();

        ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
        if (os.getToken() != null) {
            try {
                return ow.writeValueAsString(sdkService.getserverList(os));
            }catch(Exception ex) {
                System.out.println(ex.getMessage());
                System.out.println(VStackUtils.returnExceptionTrace(ex));
                return null;
            }
        }
        return null;
    }

    @RequestMapping(value = "/getImageListSDK", method = RequestMethod.GET)
    public @ResponseBody String getImageList() {
        OSClient.OSClientV3 os = authenticateUser();
        ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
        if (os.getToken() != null) {
            try {
                return ow.writeValueAsString(sdkService.getImageList(os));
            }catch(Exception ex) {
                System.out.println(ex.getMessage());
                System.out.println(VStackUtils.returnExceptionTrace(ex));
                return null;
            }
        }
        return null;
    }

    @RequestMapping(value = "/getflavorListSDK", method = RequestMethod.GET)
    public @ResponseBody String getflavorList() {
        OSClient.OSClientV3 os = authenticateUser();
        ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
        if (os.getToken() != null) {
            try {
                return ow.writeValueAsString(sdkService.getflavorList(os));
            }catch(Exception ex) {
                System.out.println(ex.getMessage());
                System.out.println(VStackUtils.returnExceptionTrace(ex));
                return null;
            }
        }
        return null;
    }

//    @RequestMapping(value = "/gethypervisorstatsSDK", method = RequestMethod.GET)
//    public @ResponseBody String gethypervisorstats() {
//        OSClient.OSClientV3 os = authenticateUser();
//        ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
//        if (os.getToken() != null) {
//            try {
//                return os.compute().hypervisors().list();
//            }catch(Exception ex) {
//                System.out.println(ex.getMessage());
//                System.out.println(VStackUtils.returnExceptionTrace(ex));
//                return null;
//            }
//        }
//        return null;
//    }

    @RequestMapping(value = "/allocatefipSDK", method = RequestMethod.POST)
    public @ResponseBody String allocateFloatingIP(@RequestBody String instancename) {
        OSClient.OSClientV3 os = authenticateUser();
        if (os.getToken() != null) {
            return sdkService.allocateFloatingIP(os,instancename);

        }
        return null;
    }



    @RequestMapping(value = "/startInstanceSDK", method = RequestMethod.POST)
    public @ResponseBody String startInstance(@RequestBody String instancename) {
        OSClient.OSClientV3 os = authenticateUser();
        if (os.getToken() != null) {
            return sdkService.startInstance(os,instancename);

        }
        return null;
    }

    @RequestMapping(value = "/pauseInstanceSDK", method = RequestMethod.POST)
    public @ResponseBody String pauseInstance(@RequestBody String instancename) {
        OSClient.OSClientV3 os = authenticateUser();
        if (os.getToken() != null) {
            return sdkService.pauseInstance(os,instancename);
        }
        return null;
    }

    @RequestMapping(value = "/stopInstanceSDK", method = RequestMethod.POST)
    public @ResponseBody String stopInstance(@RequestBody String instancename) {
        OSClient.OSClientV3 os = authenticateUser();
        if (os.getToken() != null) {
            return sdkService.stopInstance(os,instancename);
        }
        return null;
    }

    @RequestMapping(value = "/resumeInstanceSDK", method = RequestMethod.POST)
    public @ResponseBody String resumedInstance(@RequestBody String instancename) {

        OSClient.OSClientV3 os = authenticateUser();
        if (os.getToken() != null) {
            return sdkService.resumeInstance(os,instancename);
        }
        return null;
    }

    @RequestMapping(value = "/deleteInstanceSDK", method = RequestMethod.POST)
    public @ResponseBody String deleteInstance(@RequestBody String instance) {
        OSClient.OSClientV3 os = authenticateUser();
        if (os.getToken() != null) {
            return sdkService.deleteInstance(os,instance);
        }
        return null;
    }



    private OSClient.OSClientV3 authenticateUser(){
        OSClient.OSClientV3 os =  OSFactory.builderV3()
                .endpoint("http://127.0.0.1:5000/v3")
                .withConfig(org.openstack4j.core.transport.Config.newConfig().withEndpointNATResolution("127.0.0.1"))
                .credentials("admin","admin_user_secret", Identifier.byId("default"))
                .scopeToProject(Identifier.byName("admin"),Identifier.byId("default"))
                .authenticate();
                return os;
    }
}
