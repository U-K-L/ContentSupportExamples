ui.UiFactory.layouts.cgGalleryImageLayout = {
  "type": "ui.FreeLayout",
  "orientation": "vertical",
  "preload": {
    "graphics": [
      {
        "path": $(function() {
          return [$tempFields.selectedImage];
        }),
        "image": $(function() {
          return o;
        })
      }, {
        "path": ["locked"],
        "image": $(function() {
          return o;
        })
      }
    ]
  },
  "frame": [0, 0, Graphics.width, Graphics.height],
  "controls": [
    {
      "type": "ui.Image",
      "frame": [0, 0],
      "formulas": [
        $(function() {
          return o.image = $tempFields.selectedImage;
        })
      ],
      "action": {
        "name": "executeFormulas",
        "params": [
          $(function() {
            return $backButton.visible = !$backButton.visible;
          })
        ]
      }
    }, {
      "type": "ui.Button",
      "id": "backButton",
      "params": {
        "text": {
          "lcId": "B0FD4BF121D9E44E7589CDD35869F86F2227",
          "defaultText": "Back"
        },
        "action": {
          "name": "previousLayout"
        }
      },
      "frame": [Graphics.width - 170, Graphics.height - 65, 150, 45],
      "order": 1
    }
  ]
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLEVBQUUsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLG9CQUFyQixHQUE0QztFQUN4QyxNQUFBLEVBQVEsZUFEZ0M7RUFFeEMsYUFBQSxFQUFlLFVBRnlCO0VBR3hDLFNBQUEsRUFBVztJQUNQLFVBQUEsRUFBWTtNQUNSO1FBQUUsTUFBQSxFQUFTLENBQUEsQ0FBRSxTQUFBO2lCQUFHLENBQUMsV0FBVyxDQUFDLGFBQWI7UUFBSCxDQUFGLENBQVg7UUFBOEMsT0FBQSxFQUFVLENBQUEsQ0FBRSxTQUFBO2lCQUFHO1FBQUgsQ0FBRixDQUF4RDtPQURRLEVBRVI7UUFBRSxNQUFBLEVBQVEsQ0FBQyxRQUFELENBQVY7UUFBc0IsT0FBQSxFQUFVLENBQUEsQ0FBRSxTQUFBO2lCQUFHO1FBQUgsQ0FBRixDQUFoQztPQUZRO0tBREw7R0FINkI7RUFTeEMsT0FBQSxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxRQUFRLENBQUMsS0FBaEIsRUFBdUIsUUFBUSxDQUFDLE1BQWhDLENBVCtCO0VBVXhDLFVBQUEsRUFBWTtJQUNSO01BQ0ksTUFBQSxFQUFRLFVBRFo7TUFFSSxPQUFBLEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUZiO01BR0ksVUFBQSxFQUFZO1FBQUMsQ0FBQSxDQUFFLFNBQUE7aUJBQUcsQ0FBQyxDQUFDLEtBQUYsR0FBVSxXQUFXLENBQUM7UUFBekIsQ0FBRixDQUFEO09BSGhCO01BSUksUUFBQSxFQUFVO1FBQUUsTUFBQSxFQUFRLGlCQUFWO1FBQTZCLFFBQUEsRUFBVTtVQUFDLENBQUEsQ0FBRSxTQUFBO21CQUFHLFdBQVcsQ0FBQyxPQUFaLEdBQXNCLENBQUMsV0FBVyxDQUFDO1VBQXRDLENBQUYsQ0FBRDtTQUF2QztPQUpkO0tBRFEsRUFPUjtNQUNJLE1BQUEsRUFBUSxXQURaO01BRUksSUFBQSxFQUFNLFlBRlY7TUFHSSxRQUFBLEVBQVU7UUFBRSxNQUFBLEVBQVE7VUFBRSxNQUFBLEVBQVEsc0NBQVY7VUFBa0QsYUFBQSxFQUFlLE1BQWpFO1NBQVY7UUFBcUYsUUFBQSxFQUFVO1VBQUUsTUFBQSxFQUFRLGdCQUFWO1NBQS9GO09BSGQ7TUFJSSxPQUFBLEVBQVMsQ0FBQyxRQUFRLENBQUMsS0FBVCxHQUFpQixHQUFsQixFQUF1QixRQUFRLENBQUMsTUFBVCxHQUFrQixFQUF6QyxFQUE2QyxHQUE3QyxFQUFrRCxFQUFsRCxDQUpiO01BS0ksT0FBQSxFQUFTLENBTGI7S0FQUTtHQVY0QiIsInNvdXJjZXNDb250ZW50IjpbInVpLlVpRmFjdG9yeS5sYXlvdXRzLmNnR2FsbGVyeUltYWdlTGF5b3V0ID0ge1xuICAgIFwidHlwZVwiOiBcInVpLkZyZWVMYXlvdXRcIixcbiAgICBcIm9yaWVudGF0aW9uXCI6IFwidmVydGljYWxcIixcbiAgICBcInByZWxvYWRcIjoge1xuICAgICAgICBcImdyYXBoaWNzXCI6IFtcbiAgICAgICAgICAgIHsgXCJwYXRoXCI6ICgkIC0+IFskdGVtcEZpZWxkcy5zZWxlY3RlZEltYWdlXSksIFwiaW1hZ2VcIjogKCQgLT4gbyl9LFxuICAgICAgICAgICAgeyBcInBhdGhcIjogW1wibG9ja2VkXCJdLCBcImltYWdlXCI6ICgkIC0+IG8pfVxuICAgICAgICBdXG4gICAgfSxcbiAgICBcImZyYW1lXCI6IFswLCAwLCBHcmFwaGljcy53aWR0aCwgR3JhcGhpY3MuaGVpZ2h0XSxcbiAgICBcImNvbnRyb2xzXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwidWkuSW1hZ2VcIixcbiAgICAgICAgICAgIFwiZnJhbWVcIjogWzAsIDBdLFxuICAgICAgICAgICAgXCJmb3JtdWxhc1wiOiBbJCAtPiBvLmltYWdlID0gJHRlbXBGaWVsZHMuc2VsZWN0ZWRJbWFnZV0sXG4gICAgICAgICAgICBcImFjdGlvblwiOiB7IFwibmFtZVwiOiBcImV4ZWN1dGVGb3JtdWxhc1wiLCBcInBhcmFtc1wiOiBbJCAtPiAkYmFja0J1dHRvbi52aXNpYmxlID0gISRiYWNrQnV0dG9uLnZpc2libGVdIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwidWkuQnV0dG9uXCIsXG4gICAgICAgICAgICBcImlkXCI6IFwiYmFja0J1dHRvblwiLFxuICAgICAgICAgICAgXCJwYXJhbXNcIjogeyBcInRleHRcIjogeyBcImxjSWRcIjogXCJCMEZENEJGMTIxRDlFNDRFNzU4OUNERDM1ODY5Rjg2RjIyMjdcIiwgXCJkZWZhdWx0VGV4dFwiOiBcIkJhY2tcIiB9LCBcImFjdGlvblwiOiB7IFwibmFtZVwiOiBcInByZXZpb3VzTGF5b3V0XCIgfSB9LFxuICAgICAgICAgICAgXCJmcmFtZVwiOiBbR3JhcGhpY3Mud2lkdGggLSAxNzAsIEdyYXBoaWNzLmhlaWdodCAtIDY1LCAxNTAsIDQ1XSxcbiAgICAgICAgICAgIFwib3JkZXJcIjogMVxuICAgICAgICB9XG4gICAgXVxufSJdfQ==
//# sourceURL=Layout_CGGalleryEntry_61.js