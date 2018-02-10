package com.rainbow.services;

import com.rainbow.beans.CustomFlavor;
import com.rainbow.beans.CustomImage;
import com.rainbow.beans.VMInstance;
import org.openstack4j.api.Builders;
import org.openstack4j.api.OSClient;
import org.openstack4j.model.common.ActionResponse;
import org.openstack4j.model.compute.*;
import org.openstack4j.model.network.NetFloatingIP;
import org.openstack4j.model.network.Network;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class SDKService {



    //Get image list
    public List<CustomImage> getImageList (OSClient.OSClientV3 os){
        List<? extends Image> images = os.compute().images().list();
        List<CustomImage> imagelist = new ArrayList<>();
        for (Image img:images) {
            CustomImage myimg = new CustomImage();
            myimg.setImageID(img.getId());
            myimg.setImageName(img.getName());
            imagelist.add(myimg);
            }
        return imagelist;

    }

    //Get image id by passing image name
    public String getImageID (OSClient.OSClientV3 os, String imageName){
        List<? extends Image> images = os.compute().images().list();
        String imageId = null;
        for (Image img:images) {
            if(img.getName().equals(imageName)){
                imageId=img.getId();
            }

            System.out.println(img);

        }
        return imageId;

    }

    //Get flavor list
    public List<CustomFlavor> getflavorList (OSClient.OSClientV3 os){
        List<? extends Flavor> flavors =os.compute().flavors().list();
        List<CustomFlavor> flavorlist = new ArrayList<>();
        for (Flavor flvr:flavors) {
            CustomFlavor myflvr = new CustomFlavor();
            myflvr.setFlavorID(flvr.getId());
            myflvr.setFlavorName(flvr.getName());
            flavorlist.add(myflvr);
        }
        return flavorlist;

    }

    //Get flavor id by passing flavor name
    public String getFlavorID (OSClient.OSClientV3 os, String flavorName){
        List<? extends Flavor> flavors =os.compute().flavors().list();
        String flavorID=null;
        for (Flavor flv:flavors) {
            if(flv.getName().equals(flavorName)){
                flavorID=flv.getId();
            }

            System.out.println(flv);

        }
        return flavorID;
    }

    //Get server id by passing server name
    public String getServerID (OSClient.OSClientV3 os, String ServerName){
        List<? extends Server> serverLists =os.compute().servers().list();
        String serverID=null;
        for (Server srv:serverLists) {
            if(srv.getName().equals(ServerName)){
                serverID=srv.getId();
            }

            System.out.println(srv);

        }
        return serverID;
    }

    //Get network id by passing network name
    public List<String> getNetworkIDList (OSClient.OSClientV3 os, List<String> networkNames){
        List<String> ntwrklst = new ArrayList<>();
        List<? extends Network> networks = os.networking().network().list();
        Map<String,String> nameIdMap = new HashMap<>();

        networks.stream().forEach(network->{
            nameIdMap.put(network.getName(),network.getId());
        });

        networkNames.stream().forEach(networkName -> {
            System.out.println("Network name "+networkName);
            System.out.println("Network value "+nameIdMap.get(networkName));
            ntwrklst.add(nameIdMap.get(networkName));
        });


        return ntwrklst;
    }

    //Get server list
    public List<VMInstance> getserverList (OSClient.OSClientV3 os){
        List<? extends Server> serverList =os.compute().servers().list();
        List<VMInstance> vmlist= new ArrayList<>();

        for (Server server:serverList) {

            VMInstance vm = new VMInstance();

            Map<String, String> md = os.compute().servers().getMetadata(server.getId());
            String dateFromMap = md.get("createdTimeCoustom");
            DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
            long diffMins = 0;
            try {
                Date date2;
                date2 = dateFormat.parse(dateFromMap);
                Long mapTimeMills = date2.getTime();

                Long diffMilliSec = new Date().getTime()-mapTimeMills;
                long diffSeconds = diffMilliSec/1000;
                 diffMins=diffSeconds/60;

                System.out.println("diffSeconds "+ diffSeconds);
            }catch(Exception e){
                System.out.println(e);
            }



            vm.setServerType(md.get("serverTypeCoustom"));
            vm.setCreatedTime(Long.toString(diffMins));
            vm.setInstanceName(server.getName());
            vm.setImageId(os.compute().images().get(server.getImageId()).getName());
            vm.setFlavorId(os.compute().flavors().get(server.getFlavorId()).getName());
            vm.setStatus(getStatus(server.getPowerState()));


//Getting floating ip adrs
            Map<String, List<? extends Address>> mp =server.getAddresses().getAddresses();

            for (Map.Entry<String, List<? extends Address>> me : mp.entrySet()) {
                String key = me.getKey();
                List<? extends Address> valueList = me.getValue();
                System.out.println("Key: " + key);
                System.out.print("Values: ");
                for (Address s : valueList) {
                    if(s.getType().equals("floating"))
                        vm.setFloatingIP(s.getAddr());
                    System.out.print(s.getAddr() + " ");
                }
            }
            vmlist.add(vm);


        }
        return vmlist;
    }


        //Generate server builder
    public String launchInstance(OSClient.OSClientV3 os, VMInstance vmInstance){

        DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        Date date = new Date();
        System.out.println("Date in Date: "+dateFormat.format(date));
        String dateStr = dateFormat.format(date);

        ServerCreate sc = Builders.server()
                .name(vmInstance.getInstanceName())
                .addMetadataItem("createdTimeCoustom",dateStr)
                .addMetadataItem("serverTypeCoustom",vmInstance.getServerType())
                .flavor(getFlavorID(os,vmInstance.getFlavorId()))
                .image(getImageID(os,vmInstance.getImageId()))
                .networks(getNetworkIDList(os, vmInstance.getNetworkIdList()))
                .build();

        Server server = os.compute().servers().boot(sc);

        return "Instance Launched";
    }

    public String allocateFloatingIP(OSClient.OSClientV3 os, String instanceName){

        //Allocating floating ip
        FloatingIP ip = os.compute().floatingIps().allocateIP("provider");
        System.out.println("FloatingIP from pool" +ip);
        System.out.println("FloatingIPaddress" +ip.getFloatingIpAddress());

        Server server = os.compute().servers().get(getServerID(os,instanceName));
        System.out.println("server "+server);

        ActionResponse r = os.compute().floatingIps().addFloatingIP(server, ip.getFloatingIpAddress());
         if(r.getCode()==200){
             return "Floating IP Allocated";
         }
//        ActionResponse = osClient.compute().floatingIps().addFloatingIP(server, netFloatingIP.getFloatingIpAddress());
        return "Something went wrong. Please try after sometime";
    }

    //get status by status id
    private String getStatus(String statusCode){
        String status=null;
        switch (statusCode){
            case "0": status= "BUILD IN PROGRESS...";break;
            case "1": status= "RUNNING";break;
            case "3": status= "PAUSED";break;
            case "4": status= "SHUTOFF";
        }
        return status;
    }

    public String resumeInstance(OSClient.OSClientV3 os, String instanceName){

        String instanceID=getServerID(os,instanceName);
        os.compute().servers().action(instanceID, Action.UNPAUSE);
        return "Instance resumed";
    }

    public String stopInstance(OSClient.OSClientV3 os, String instanceName){

        String instanceID=getServerID(os,instanceName);
        os.compute().servers().action(instanceID, Action.STOP);
        return "Instance stopped";
    }

    public String startInstance(OSClient.OSClientV3 os, String instanceName){

        String instanceID=getServerID(os,instanceName);
        ActionResponse res =os.compute().servers().action(instanceID, Action.START);
        System.out.println(res.getCode());
        return "Instance started";
    }

    public String pauseInstance(OSClient.OSClientV3 os, String instanceName){

        String instanceID=getServerID(os,instanceName);
        os.compute().servers().action(instanceID, Action.PAUSE);
        return "Instance paused";
    }

    public String deleteInstance(OSClient.OSClientV3 os, String instanceName){

        String instanceID=getServerID(os,instanceName);
        os.compute().servers().delete(instanceID);
        return "Instance deleted";
    }

    //Generate server builder
    public String launchInstanceNew(OSClient.OSClientV3 os, VMInstance vmInstance)  {
        /*
        DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        Date date = new Date();
        System.out.println("Date in Date: "+dateFormat.format(date));
        String dateStr = dateFormat.format(date);
        System.out.println("Date in String: "+ dateStr);
        try {
            Date date2 = dateFormat.parse(dateStr);
        }catch(Exception e){
            System.out.println(e);
        }


        ServerCreate sc = Builders.server()
                .name(vmInstance.getInstanceName())
                .addMetadataItem("CreatedTime",dateStr)
                .flavor(getFlavorID(os,vmInstance.getFlavorId()))
                .image(getImageID(os,vmInstance.getImageId()))
                .networks(getNetworkIDList(os, vmInstance.getNetworkIdList()))
                .build();

        Server server = os.compute().servers().boot(sc);
        return "Instance Launched";
*/
        String instanceID=getServerID(os,"test123");
        Map<String, String> md = os.compute().servers().getMetadata(instanceID);
        System.out.println(md);

        String dateFromMap = md.get("CreatedTime");

        DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        Date date2;
        try {
             date2 = dateFormat.parse(dateFromMap);
            Long mapTimeMills = date2.getTime();

            Long diffMilliSec = new Date().getTime()-mapTimeMills;
            long diffSeconds = diffMilliSec/1000;

            System.out.println("diffSeconds "+ diffSeconds);
        }catch(Exception e){
            System.out.println(e);
        }





        return"abc";

    }

}
