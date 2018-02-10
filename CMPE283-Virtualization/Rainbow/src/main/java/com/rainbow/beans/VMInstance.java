package com.rainbow.beans;

import java.util.List;

public class VMInstance {



    private String instanceName;
    private String flavorId;
    private String imageId;
    private List<String> networkIdList;
    private String Status;
    private String serverType;

    public String getFloatingIP() {
        return floatingIP;
    }

    public void setFloatingIP(String floatingIP) {
        this.floatingIP = floatingIP;
    }

    private String floatingIP;



    private String createdTime;

    public String getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(String createdTime) {
        this.createdTime = createdTime;
    }

    public String getServerType() {
        return serverType;
    }

    public void setServerType(String serverType) {
        this.serverType = serverType;
    }

    public VMInstance() {
        this.instanceName = null;
        this.flavorId = null;
        this.imageId = null;
        this.networkIdList = null;
    }

    public VMInstance(String instanceName, String flavorId, String imageId, List<String> networkIdList, String serverType) {
        this.instanceName = instanceName;
        this.flavorId = flavorId;
        this.imageId = imageId;
        this.networkIdList = networkIdList;
        this.serverType=serverType;
    }

    public String getStatus() {
        return Status;
    }

    public void setStatus(String status) {
        Status = status;
    }


    public String getInstanceName() {
        return instanceName;
    }

    public void setInstanceName(String instanceName) {
        this.instanceName = instanceName;
    }

    public String getFlavorId() {
        return flavorId;
    }

    public void setFlavorId(String flavorId) {
        this.flavorId = flavorId;
    }


    public String getImageId() {
        return imageId;
    }

    public void setImageId(String imageId) {
        this.imageId = imageId;
    }



    public List<String> getNetworkIdList() {
        return networkIdList;
    }

    public void setNetworkIdList(List<String> networkIdList) {
        this.networkIdList = networkIdList;
    }


}
