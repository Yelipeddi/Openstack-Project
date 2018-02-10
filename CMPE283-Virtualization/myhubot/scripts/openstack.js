// Description:
//   Perform Openstack actions to provision and work with VMs, images or flavors.
//
// Commands:
//   hubot openstack-compute flavors - Print a list of available flavors.
//   hubot openstack-compute flavor <id> - Show details about the given flavor.
//   hubot openstack-compute servers - Print a list of all servers.
//   hubot openstack-compute server <id> - Show details about the given server.
//   hubot openstack-compute create-server <server-name> <flavor-name> <image-name> <keyname><networkname> - Creates a server with the options specified.
//   hubot openstack-compute delete-server <id> - Deletes a server with specified id or name.
//   hubot openstack-compute images - Print a list of available images to boot from.
//   hubot openstack-compute image <id> - Show details about the given image.
//   hubot openstack-compute start-server <id> - Start the instance specified by id.
//   hubot openstack-compute stop-server <id> - Stop the instance specified by id.
//
// Dependencies:
//   pkgcloud
//   underscore
//   moment
// Author:
//   wrcia <gakk@gmail.com>
const HUBOT_OPENSTACK_COMPUTE_PROVIDER ='openstack';
const HUBOT_OPENSTACK_COMPUTE_USERNAME = "admin";
const HUBOT_OPENSTACK_COMPUTE_PASSWORD= "admin_user_secret";
const HUBOT_OPENSTACK_COMPUTE_AUTHURL= "http://127.0.0.1:5000/";
const HUBOT_OPENSTACK_COMPUTE_REGION= 'RegionOne';
const HUBOT_OPENSTACK_COMPUTE_VERSION= "v3.8";
const HUBOT_OPENSTACK_COMPUTE_TENANTID="8e097d0b255e4c5a874aca0162cefb82";
const  HUBOT_OPENSTACK_COMPUTE_TENANTNAME='admin';
const HUBOT_OPENSTACK_COMPUTE_BASEPATH="";
const  HUBOT_OPENSTACK_COMPUTE_USESERVICECATALOG = true;

var
  pkgcloud = require('pkgcloud'),
  moment = require('moment'),
  _ = require('underscore'),
  computeValidate = function(msg) {
    var status = 1;

    if (typeof(HUBOT_OPENSTACK_COMPUTE_PROVIDER) === 'undefined') {
      status = 0;
      msg.send('HUBOT_OPENSTACK_COMPUTE_PROVIDER isn\'t set.');
      msg.send('Please set the HUBOT_OPENSTACK_COMPUTE_PROVIDER environment variable.');
    }

    if (typeof(HUBOT_OPENSTACK_COMPUTE_USERNAME) === 'undefined') {
      status = 0;
      msg.send('HUBOT_OPENSTACK_COMPUTE_USERNAME isn\'t set.');
      msg.send('Please set the HUBOT_OPENSTACK_COMPUTE_USERNAME environment variable.');
    }

    if (typeof(HUBOT_OPENSTACK_COMPUTE_PASSWORD) === 'undefined') {
      status = 0;
      msg.send('HUBOT_OPENSTACK_COMPUTE_PASSWORD isn\'t set.');
      msg.send('Please set the HUBOT_OPENSTACK_COMPUTE_PASSWORD environment variable.');
    }

    if (typeof(HUBOT_OPENSTACK_COMPUTE_AUTHURL) === 'undefined') {
      status = 0;
      msg.send('HUBOT_OPENSTACK_COMPUTE_AUTHURL isn\'t set.');
      msg.send('Please set the HUBOT_OPENSTACK_COMPUTE_AUTHURL environment variable.');
    }

    return status;
  },
  computeClient = function() {
    return pkgcloud.compute.createClient({
        provider:   HUBOT_OPENSTACK_COMPUTE_PROVIDER,
        username:   HUBOT_OPENSTACK_COMPUTE_USERNAME,
        password:   HUBOT_OPENSTACK_COMPUTE_PASSWORD,
        authUrl:    HUBOT_OPENSTACK_COMPUTE_AUTHURL,
        region:     HUBOT_OPENSTACK_COMPUTE_REGION,
        version:    HUBOT_OPENSTACK_COMPUTE_VERSION,
        tenantId:   HUBOT_OPENSTACK_COMPUTE_TENANTID,
        tenantName: HUBOT_OPENSTACK_COMPUTE_TENANTNAME,
        basePath:   HUBOT_OPENSTACK_COMPUTE_BASEPATH,
        useServiceCatalog: HUBOT_OPENSTACK_COMPUTE_USESERVICECATALOG
      }
    );
  },
  computeFlavorInfo = function(flavor) {
    return flavor.name +
      ' - ram:' + flavor.ram +
      ' Mo, disk: ' + flavor.disk +
      'Go, vcpus: ' + flavor.vcpus +
      ', swap: ' + flavor.swap + '\n';
  },
  computeServerInfo = function(server) {
    return server.name +
      ' / ' + server.addresses.private +
      ': ' + server.status +
      ', id: ' + server.id +
      ', key_pair: ' + server.openstack.key_name +
      ', tenant: ' + server.openstack.tenant_id +
      ', created: ' + moment(server.created).fromNow() + '\n';
  },
  computeImageInfo = function(image) {
    return image.name + ',  ' + moment(image.created).fromNow() + '\n';
  };

module.exports = function(robot) {
  robot.respond(/openstack-compute flavors/i, function(msg) {
    if (!computeValidate(msg)) {
      return;
    }

    computeClient().getFlavors(function(err, data){
      if (err) {
        msg.reply(err);
        return;
      }

      var flavors = '';
      data.forEach(function(flavor) {
        flavors += '• ' + computeFlavorInfo(flavor);
      });
      msg.reply(flavors);
    });
  });

  robot.respond(/openstack-compute flavor (.+)/i, function(msg) {
    if (!computeValidate(msg)) {
      return;
    }
    computeClient().getFlavor(msg.match[1], function(err, flavor) {
      if (err) {
        msg.reply(err);
        return;
      }

      msg.reply(computeFlavorInfo(flavor));
    });
  });


robot.respond(/openstack-compute start-server (.+)/i, function(msg) {
    if (!computeValidate(msg)) {
      return;
    }
    var starttype = {'os-start':null};

    computeClient().rebootServer(msg.match[1], starttype,function(err) {
      if (err) {
        msg.reply(err);
        return;
      }
      msg.reply('Server started');
    });
  });

robot.respond(/openstack-compute stop-server (.+)/i, function(msg) {
    if (!computeValidate(msg)) {
      return;
    }
    var stoptype = {'os-stop':null};

    computeClient().rebootServer(msg.match[1], stoptype, function(err) {
      if (err) {
        msg.reply(err);
        return;
      }
      msg.reply('Server stopped');
    });
  });


  robot.respond(/openstack-compute servers (.+)/i, function(msg) {
    // exit;
    if (!computeValidate(msg)) {
      return;
    }
//console.log(msg);
    var regexp_pattern = msg.match[1];
    var regexp = new RegExp(regexp_pattern, "gi");

    computeClient().getServers(function(err, data) {
      if (err) {
        msg.reply(err);
        console.log('****reached here1***');
        return;
      }
console.log('****reached here2***');
      var servers = '';
      data.forEach(function(server) {
        if (server.name.match(regexp)) {
          console.log('****reached here3***');
          servers += '• ' + computeServerInfo(server);
        }
      });
      console.log('****reached here4***');
      msg.reply(servers);

    });
  });

  robot.respond(/openstack-compute servers$/i, function(msg) {
    if (!computeValidate(msg)) {
      return;
    }

    computeClient().getServers(function(err, data) {
      if (err) {
        msg.reply(err);
        return;
      }

      var servers = '';
      data.forEach(function(server) {

        servers += '• ' + computeServerInfo(server);
      });

      if (!servers.length) {
        msg.reply('No provisioned servers');
        return;
      }

      msg.reply(servers);

    });
  });

  robot.respond(/openstack-compute create-server (.+) (.+) (.+) (.+) (.+)/i, function(msg) {

    if (!computeValidate(msg)) {
      return;
    }

    var client = computeClient();

    client.getFlavors(function (err, flavors) {
      if (err) {
        console.dir(err);
        return;
      }


      client.getImages(function (err, images) {
        if (err) {
          console.dir(err);
          return;
        }


        client.getNetworks(function (err, networks) {
        if (err) {
          console.dir(err);
          return;
        }
        console.log(networks);//exit;
        var flavor = _.findWhere(flavors, { name: msg.match[2] });
        if (typeof(flavor) === 'undefined') {

          msg.reply('Flavor not found.');
          return;
        }

        var image = _.findWhere(images, { name: msg.match[3] });
        if (typeof(image) === 'undefined') {
          msg.reply('Image not found.');
          return;
        }


        var network = _.findWhere(networks, { label: msg.match[5] });
        if (typeof(network) === 'undefined') {
          msg.reply('Network not found.');
          return;
        }

        // var datetime=new Date();
        // console.log(datetime);

          var d = new Date();
          var custdate=(d.getFullYear()+"/"  +("00" + (d.getMonth() + 1)).slice(-2) + "/" +
            ("00" + d.getDate()).slice(-2) + " "+
            ("00" + d.getHours()).slice(-2) + ":" +
            ("00" + d.getMinutes()).slice(-2) + ":" +
            ("00" + d.getSeconds()).slice(-2));

          console.log(custdate);



        var options = {
          name: msg.match[1],
          flavor: flavor.id,
          image: image.id,
          keyname: '',
          networks:[{uuid:network.id}],
          metadata:{createdTimeCoustom:custdate,serverTypeCoustom:'APACHE'}
        };


        computeClient().createServer(options,  function(err, server) {
          if (err) {
            console.log(err);
            return;
          }

          msg.reply('Server created: ' + server.name + ', waiting for active status');

          server.setWait({ status: server.STATUS.running }, 5000, function (err) {
            if (err) {
              msg.reply(err);
              return;
            }
            msg.reply(computeServerInfo(server));
          });
        });
      });
    });
  });
  });

  robot.respond(/openstack-compute server (.+)/i, function(msg) {
    if (!computeValidate(msg)) {
      return;
    }
    computeClient().getServer(msg.match[1], function(err, server) {
      if (err) {
        msg.reply(err);
        return;
      }
      msg.reply(computeServerInfo(server));
    });
  });

  robot.respond(/openstack-compute delete-server (.+)/i, function(msg) {
    if (!computeValidate(msg)) {
      return;
    }
    computeClient().destroyServer(msg.match[1], function(err, serverId) {
      if (err) {
        msg.reply(err);
        return;
      }
      msg.reply('Server ' + serverId.ok + '  Deleted');
    });
  });

  robot.respond(/openstack-compute images/i, function(msg) {
    if (!computeValidate(msg)) {
      return;
    }

    computeClient().getImages(function(err, data) {
      if (err) {
        msg.reply(err);
        return;
      }

      var images = '';
      data.forEach(function(image) {
        images += '• ' + computeImageInfo(image);
      });
      msg.reply(images);

    });
  });

  robot.respond(/openstack-compute image (.+)/i, function(msg) {
    if (!computeValidate(msg)) {
      return;
    }
    computeClient().getImage(msg.match[1], function(err, image) {
      if (err) {
        msg.reply(err);
        return;
      }
      msg.reply(computeImageInfo(image));
    });
  });
};
