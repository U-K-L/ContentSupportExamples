ui.UiFactory.customTypes["ui.MessageOptionButton"] = {
  "type": "ui.StackLayout",
  "sizeToFit": true,
  "style": "messageOptionButton",
  "controls": [
    {
      "type": "ui.Image",
      "inheritProperties": true,
      "selectable": true,
      "style": "messageOptionButton",
      "image": gs.UIConstants.OPTION_BUTTON_MSG_IMAGE_OFF,
      "actions": [
        {
          "name": "executeFormulas",
          "params": [
            $(function() {
              return o.parent.params.write.exec();
            }), $(function() {
              return o.parent.controls[1].ui.selected = o.ui.selected;
            })
          ]
        }, function() {
          return p.action1;
        }, function() {
          return p.action2;
        }
      ],
      "margin": [0, 0, 11, 0]
    }, {
      "type": "ui.Text",
      "inheritProperties": true,
      "sizeToFit": true,
      "style": "regularUIText",
      "selectable": true,
      "actions": [
        {
          "name": "executeFormulas",
          "params": [
            $(function() {
              return o.parent.params.write.exec();
            }), $(function() {
              return o.parent.controls[0].ui.selected = !o.parent.controls[0].ui.selected;
            }), $(function() {
              return o.ui.selected = o.parent.controls[0].ui.selected;
            })
          ]
        }, function() {
          return p.action1;
        }, function() {
          return p.action2;
        }
      ],
      "alignmentY": "center",
      "text": function() {
        return p.label;
      }
    }
  ]
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLEVBQUUsQ0FBQyxTQUFTLENBQUMsV0FBWSxDQUFBLHdCQUFBLENBQXpCLEdBQXFEO0VBQ2pELE1BQUEsRUFBUSxnQkFEeUM7RUFFakQsV0FBQSxFQUFhLElBRm9DO0VBR2pELE9BQUEsRUFBUyxxQkFId0M7RUFJakQsVUFBQSxFQUFZO0lBQ1I7TUFDSSxNQUFBLEVBQVEsVUFEWjtNQUVJLG1CQUFBLEVBQXFCLElBRnpCO01BR0ksWUFBQSxFQUFjLElBSGxCO01BSUksT0FBQSxFQUFTLHFCQUpiO01BS0ksT0FBQSxFQUFTLEVBQUUsQ0FBQyxXQUFXLENBQUMsMkJBTDVCO01BTUksU0FBQSxFQUFXO1FBQ1A7VUFDSSxNQUFBLEVBQVEsaUJBRFo7VUFFSSxRQUFBLEVBQVU7WUFDTixDQUFBLENBQUUsU0FBQTtxQkFBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBdEIsQ0FBQTtZQUFILENBQUYsQ0FETSxFQUVOLENBQUEsQ0FBRSxTQUFBO3FCQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUyxDQUFBLENBQUEsQ0FBRSxDQUFDLEVBQUUsQ0FBQyxRQUF4QixHQUFtQyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQTNDLENBQUYsQ0FGTTtXQUZkO1NBRE8sRUFRUCxTQUFBO2lCQUFHLENBQUMsQ0FBQztRQUFMLENBUk8sRUFTUCxTQUFBO2lCQUFHLENBQUMsQ0FBQztRQUFMLENBVE87T0FOZjtNQWlCSSxRQUFBLEVBQVUsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLEVBQVAsRUFBVyxDQUFYLENBakJkO0tBRFEsRUFvQlI7TUFDSSxNQUFBLEVBQVEsU0FEWjtNQUVJLG1CQUFBLEVBQXFCLElBRnpCO01BR0ksV0FBQSxFQUFhLElBSGpCO01BSUksT0FBQSxFQUFTLGVBSmI7TUFLSSxZQUFBLEVBQWMsSUFMbEI7TUFNSSxTQUFBLEVBQVc7UUFDUDtVQUNJLE1BQUEsRUFBUSxpQkFEWjtVQUVJLFFBQUEsRUFBVTtZQUNOLENBQUEsQ0FBRSxTQUFBO3FCQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUF0QixDQUFBO1lBQUgsQ0FBRixDQURNLEVBRU4sQ0FBQSxDQUFFLFNBQUE7cUJBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFTLENBQUEsQ0FBQSxDQUFFLENBQUMsRUFBRSxDQUFDLFFBQXhCLEdBQW1DLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFTLENBQUEsQ0FBQSxDQUFFLENBQUMsRUFBRSxDQUFDO1lBQS9ELENBQUYsQ0FGTSxFQUdOLENBQUEsQ0FBRSxTQUFBO3FCQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBTCxHQUFnQixDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxFQUFFLENBQUM7WUFBM0MsQ0FBRixDQUhNO1dBRmQ7U0FETyxFQVNQLFNBQUE7aUJBQUcsQ0FBQyxDQUFDO1FBQUwsQ0FUTyxFQVVQLFNBQUE7aUJBQUcsQ0FBQyxDQUFDO1FBQUwsQ0FWTztPQU5mO01Ba0JJLFlBQUEsRUFBYyxRQWxCbEI7TUFtQkksTUFBQSxFQUFRLFNBQUE7ZUFBRyxDQUFDLENBQUM7TUFBTCxDQW5CWjtLQXBCUTtHQUpxQyIsInNvdXJjZXNDb250ZW50IjpbInVpLlVpRmFjdG9yeS5jdXN0b21UeXBlc1tcInVpLk1lc3NhZ2VPcHRpb25CdXR0b25cIl0gPSB7XG4gICAgXCJ0eXBlXCI6IFwidWkuU3RhY2tMYXlvdXRcIixcbiAgICBcInNpemVUb0ZpdFwiOiB0cnVlLFxuICAgIFwic3R5bGVcIjogXCJtZXNzYWdlT3B0aW9uQnV0dG9uXCIsXG4gICAgXCJjb250cm9sc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInVpLkltYWdlXCIsXG4gICAgICAgICAgICBcImluaGVyaXRQcm9wZXJ0aWVzXCI6IHRydWUsXG4gICAgICAgICAgICBcInNlbGVjdGFibGVcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwic3R5bGVcIjogXCJtZXNzYWdlT3B0aW9uQnV0dG9uXCIsXG4gICAgICAgICAgICBcImltYWdlXCI6IGdzLlVJQ29uc3RhbnRzLk9QVElPTl9CVVRUT05fTVNHX0lNQUdFX09GRixcbiAgICAgICAgICAgIFwiYWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgeyBcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZXhlY3V0ZUZvcm11bGFzXCIsIFxuICAgICAgICAgICAgICAgICAgICBcInBhcmFtc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAkIC0+IG8ucGFyZW50LnBhcmFtcy53cml0ZS5leGVjKClcbiAgICAgICAgICAgICAgICAgICAgICAgICQgLT4gby5wYXJlbnQuY29udHJvbHNbMV0udWkuc2VsZWN0ZWQgPSBvLnVpLnNlbGVjdGVkXG4gICAgICAgICAgICAgICAgICAgIF0gXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAtPiBwLmFjdGlvbjEsXG4gICAgICAgICAgICAgICAgLT4gcC5hY3Rpb24yXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJtYXJnaW5cIjogWzAsIDAsIDExLCAwXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJ1aS5UZXh0XCIsXG4gICAgICAgICAgICBcImluaGVyaXRQcm9wZXJ0aWVzXCI6IHRydWUsXG4gICAgICAgICAgICBcInNpemVUb0ZpdFwiOiB0cnVlLFxuICAgICAgICAgICAgXCJzdHlsZVwiOiBcInJlZ3VsYXJVSVRleHRcIixcbiAgICAgICAgICAgIFwic2VsZWN0YWJsZVwiOiB0cnVlLFxuICAgICAgICAgICAgXCJhY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICB7IFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJleGVjdXRlRm9ybXVsYXNcIiwgXG4gICAgICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICQgLT4gby5wYXJlbnQucGFyYW1zLndyaXRlLmV4ZWMoKVxuICAgICAgICAgICAgICAgICAgICAgICAgJCAtPiBvLnBhcmVudC5jb250cm9sc1swXS51aS5zZWxlY3RlZCA9ICFvLnBhcmVudC5jb250cm9sc1swXS51aS5zZWxlY3RlZFxuICAgICAgICAgICAgICAgICAgICAgICAgJCAtPiBvLnVpLnNlbGVjdGVkID0gby5wYXJlbnQuY29udHJvbHNbMF0udWkuc2VsZWN0ZWRcbiAgICAgICAgICAgICAgICAgICAgXSBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC0+IHAuYWN0aW9uMVxuICAgICAgICAgICAgICAgIC0+IHAuYWN0aW9uMlxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwiYWxpZ25tZW50WVwiOiBcImNlbnRlclwiLFxuICAgICAgICAgICAgXCJ0ZXh0XCI6IC0+IHAubGFiZWxcbiAgICAgICAgfVxuICAgIF1cbn0iXX0=
//# sourceURL=Template_MessageOptionButton_151.js