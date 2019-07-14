ui.UiFactory.layouts.loadMenuLayout = {
  "type": "ui.FreeLayout",
  "frame": [0, 0, Graphics.width, Graphics.height],
  "preload": {
    graphics: [
      {
        name: $(function() {
          return $dataFields.database.system.menuBackground.name || 'bg-generic';
        })
      }
    ]
  },
  "controls": [
    {
      "type": "ui.Image",
      "image": function() {
        return $dataFields.database.system.menuBackground.name || 'bg-generic';
      },
      "frame": [0, 0, Graphics.width, Graphics.height],
      "action": {
        "event": "onCancel",
        "name": "previousLayout",
        "params": {}
      }
    }, {
      "type": "ui.BackButton",
      "frame": [Graphics.width - 170, Graphics.height - 65, 150, 45]
    }, {
      "type": "ui.TitledWindow",
      "frame": [20, 0, Math.floor((Graphics.width - 200) / 420) * 420, Graphics.height],
      "params": {
        "title": {
          "lcId": "B215F6EB2576884547399CC0CF2F38E855FD",
          "defaultText": "Load Game"
        }
      }
    }, {
      "type": "ui.DataScrollView",
      "id": "list",
      "frame": [20, 45, Math.floor((Graphics.width - 200) / 420) * 420, Graphics.height - 45],
      "params": {
        "columns": Math.floor((Graphics.width - 200) / 420),
        "spacing": [10, 10],
        "dataSource": $(function() {
          return $dataFields.saveGameSlots;
        }),
        "template": {
          "descriptor": {
            "type": "ui.SaveGameSlot",
            "params": {
              "actions": [
                {
                  "name": "executeFormulas",
                  "params": [
                    $(function() {
                      return $tempFields.slot = o.parent.index;
                    })
                  ]
                }, {
                  "name": "createControl",
                  "conditions": [
                    {
                      "field": $(function() {
                        var ref;
                        return (ref = $dataFields.saveGameSlots[$tempFields.slot]) != null ? ref.date : void 0;
                      }),
                      "notEqualTo": $(function() {
                        return '';
                      })
                    }, {
                      "field": $(function() {
                        return $dataFields.settings.confirmation;
                      }),
                      "equalTo": true
                    }, {
                      "field": $(function() {
                        return $dataFields.tempSettings.loadMenuAccess;
                      }),
                      "equalTo": true
                    }
                  ],
                  "params": {
                    "descriptor": {
                      "id": "confirmationDialog",
                      "type": "ui.ConfirmationDialog",
                      "zIndex": 90000,
                      "params": {
                        "message": {
                          "lcId": "2BD08CC65B9A2248C749B9C4DEEAADE8E20A",
                          "defaultText": "Do you really want to load?"
                        },
                        "acceptActions": [
                          {
                            "name": "loadGame",
                            "params": {
                              "slot": $(function() {
                                return $tempFields.slot;
                              })
                            }
                          }
                        ],
                        "rejectActions": [
                          {
                            "name": "disposeControl",
                            "params": $(function() {
                              return 'confirmationDialog';
                            })
                          }
                        ]
                      }
                    }
                  }
                }, {
                  "conditions": [
                    {
                      "field": $(function() {
                        var ref;
                        return (ref = $dataFields.saveGameSlots[$tempFields.slot]) != null ? ref.date : void 0;
                      }),
                      "notEqualTo": $(function() {
                        return '';
                      })
                    }, {
                      "field": $(function() {
                        return !$dataFields.settings.confirmation || !$dataFields.tempSettings.loadMenuAccess;
                      }),
                      "equalTo": true
                    }
                  ],
                  "name": "loadGame",
                  "params": {
                    "slot": $(function() {
                      return $tempFields.slot;
                    })
                  }
                }
              ]
            }
          }
        }
      }
    }
  ]
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLEVBQUUsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGNBQXJCLEdBQXNDO0VBQ2xDLE1BQUEsRUFBUSxlQUQwQjtFQUVsQyxPQUFBLEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLFFBQVEsQ0FBQyxLQUFoQixFQUF1QixRQUFRLENBQUMsTUFBaEMsQ0FGeUI7RUFHbEMsU0FBQSxFQUFXO0lBQUUsUUFBQSxFQUFVO01BQUM7UUFBQSxJQUFBLEVBQU0sQ0FBQSxDQUFFLFNBQUE7aUJBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQTNDLElBQW1EO1FBQXRELENBQUYsQ0FBTjtPQUFEO0tBQVo7R0FIdUI7RUFJbEMsVUFBQSxFQUFZO0lBQ1I7TUFDSSxNQUFBLEVBQVEsVUFEWjtNQUVJLE9BQUEsRUFBUyxTQUFBO2VBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQTNDLElBQW1EO01BQXRELENBRmI7TUFHSSxPQUFBLEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLFFBQVEsQ0FBQyxLQUFoQixFQUF1QixRQUFRLENBQUMsTUFBaEMsQ0FIYjtNQUlJLFFBQUEsRUFBVTtRQUFFLE9BQUEsRUFBUyxVQUFYO1FBQXVCLE1BQUEsRUFBUSxnQkFBL0I7UUFBaUQsUUFBQSxFQUFVLEVBQTNEO09BSmQ7S0FEUSxFQU9SO01BQ0ksTUFBQSxFQUFRLGVBRFo7TUFFSSxPQUFBLEVBQVMsQ0FBQyxRQUFRLENBQUMsS0FBVCxHQUFpQixHQUFsQixFQUF1QixRQUFRLENBQUMsTUFBVCxHQUFrQixFQUF6QyxFQUE2QyxHQUE3QyxFQUFrRCxFQUFsRCxDQUZiO0tBUFEsRUFXUjtNQUNJLE1BQUEsRUFBUSxpQkFEWjtNQUVJLE9BQUEsRUFBUyxDQUFDLEVBQUQsRUFBSyxDQUFMLEVBQVEsSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFDLFFBQVEsQ0FBQyxLQUFULEdBQWUsR0FBaEIsQ0FBQSxHQUFxQixHQUFoQyxDQUFBLEdBQXFDLEdBQTdDLEVBQWtELFFBQVEsQ0FBQyxNQUEzRCxDQUZiO01BR0ksUUFBQSxFQUFVO1FBQUUsT0FBQSxFQUFTO1VBQUUsTUFBQSxFQUFRLHNDQUFWO1VBQWtELGFBQUEsRUFBZSxXQUFqRTtTQUFYO09BSGQ7S0FYUSxFQWdCUjtNQUNJLE1BQUEsRUFBUSxtQkFEWjtNQUVJLElBQUEsRUFBTSxNQUZWO01BR0ksT0FBQSxFQUFTLENBQUMsRUFBRCxFQUFLLEVBQUwsRUFBUyxJQUFJLENBQUMsS0FBTCxDQUFXLENBQUMsUUFBUSxDQUFDLEtBQVQsR0FBZSxHQUFoQixDQUFBLEdBQXFCLEdBQWhDLENBQUEsR0FBcUMsR0FBOUMsRUFBbUQsUUFBUSxDQUFDLE1BQVQsR0FBa0IsRUFBckUsQ0FIYjtNQUlJLFFBQUEsRUFBVTtRQUNOLFNBQUEsRUFBVyxJQUFJLENBQUMsS0FBTCxDQUFXLENBQUMsUUFBUSxDQUFDLEtBQVQsR0FBZSxHQUFoQixDQUFBLEdBQXFCLEdBQWhDLENBREw7UUFFTixTQUFBLEVBQVcsQ0FBQyxFQUFELEVBQUssRUFBTCxDQUZMO1FBR04sWUFBQSxFQUFlLENBQUEsQ0FBRSxTQUFBO2lCQUFHLFdBQVcsQ0FBQztRQUFmLENBQUYsQ0FIVDtRQUlOLFVBQUEsRUFBWTtVQUNSLFlBQUEsRUFBYztZQUNWLE1BQUEsRUFBUSxpQkFERTtZQUVWLFFBQUEsRUFBVTtjQUNOLFNBQUEsRUFBVztnQkFDUDtrQkFDSSxNQUFBLEVBQVEsaUJBRFo7a0JBRUksUUFBQSxFQUFVO29CQUNOLENBQUEsQ0FBRSxTQUFBOzZCQUFHLFdBQVcsQ0FBQyxJQUFaLEdBQW1CLENBQUMsQ0FBQyxNQUFNLENBQUM7b0JBQS9CLENBQUYsQ0FETTttQkFGZDtpQkFETyxFQU9QO2tCQUNJLE1BQUEsRUFBUSxlQURaO2tCQUVJLFlBQUEsRUFBYztvQkFDVjtzQkFBRSxPQUFBLEVBQVUsQ0FBQSxDQUFFLFNBQUE7QUFBRyw0QkFBQTtnR0FBMkMsQ0FBRTtzQkFBaEQsQ0FBRixDQUFaO3NCQUFxRSxZQUFBLEVBQWUsQ0FBQSxDQUFFLFNBQUE7K0JBQUc7c0JBQUgsQ0FBRixDQUFwRjtxQkFEVSxFQUVWO3NCQUFFLE9BQUEsRUFBVSxDQUFBLENBQUUsU0FBQTsrQkFBRyxXQUFXLENBQUMsUUFBUSxDQUFDO3NCQUF4QixDQUFGLENBQVo7c0JBQXFELFNBQUEsRUFBVyxJQUFoRTtxQkFGVSxFQUdWO3NCQUFFLE9BQUEsRUFBVSxDQUFBLENBQUUsU0FBQTsrQkFBRyxXQUFXLENBQUMsWUFBWSxDQUFDO3NCQUE1QixDQUFGLENBQVo7c0JBQTJELFNBQUEsRUFBVyxJQUF0RTtxQkFIVTttQkFGbEI7a0JBT0ksUUFBQSxFQUFVO29CQUNOLFlBQUEsRUFBYztzQkFDVixJQUFBLEVBQU0sb0JBREk7c0JBRVYsTUFBQSxFQUFRLHVCQUZFO3NCQUdWLFFBQUEsRUFBVSxLQUhBO3NCQUlWLFFBQUEsRUFBVTt3QkFDTixTQUFBLEVBQVc7MEJBQUUsTUFBQSxFQUFRLHNDQUFWOzBCQUFrRCxhQUFBLEVBQWUsNkJBQWpFO3lCQURMO3dCQUVOLGVBQUEsRUFBaUI7MEJBQUM7NEJBQUUsTUFBQSxFQUFRLFVBQVY7NEJBQXNCLFFBQUEsRUFBVTs4QkFBRSxNQUFBLEVBQVMsQ0FBQSxDQUFFLFNBQUE7dUNBQUcsV0FBVyxDQUFDOzhCQUFmLENBQUYsQ0FBWDs2QkFBaEM7MkJBQUQ7eUJBRlg7d0JBR04sZUFBQSxFQUFpQjswQkFBQzs0QkFBQyxNQUFBLEVBQU8sZ0JBQVI7NEJBQXlCLFFBQUEsRUFBVSxDQUFBLENBQUUsU0FBQTtxQ0FBRzs0QkFBSCxDQUFGLENBQW5DOzJCQUFEO3lCQUhYO3VCQUpBO3FCQURSO21CQVBkO2lCQVBPLEVBMEJQO2tCQUFFLFlBQUEsRUFBYztvQkFDWjtzQkFBRSxPQUFBLEVBQVUsQ0FBQSxDQUFFLFNBQUE7QUFBRyw0QkFBQTtnR0FBMkMsQ0FBRTtzQkFBaEQsQ0FBRixDQUFaO3NCQUFxRSxZQUFBLEVBQWUsQ0FBQSxDQUFFLFNBQUE7K0JBQUc7c0JBQUgsQ0FBRixDQUFwRjtxQkFEWSxFQUVaO3NCQUFFLE9BQUEsRUFBVSxDQUFBLENBQUUsU0FBQTsrQkFBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsWUFBdEIsSUFBc0MsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDO3NCQUFuRSxDQUFGLENBQVo7c0JBQWtHLFNBQUEsRUFBVyxJQUE3RztxQkFGWTttQkFBaEI7a0JBR0csTUFBQSxFQUFRLFVBSFg7a0JBR3VCLFFBQUEsRUFBVTtvQkFBRSxNQUFBLEVBQVMsQ0FBQSxDQUFFLFNBQUE7NkJBQUcsV0FBVyxDQUFDO29CQUFmLENBQUYsQ0FBWDttQkFIakM7aUJBMUJPO2VBREw7YUFGQTtXQUROO1NBSk47T0FKZDtLQWhCUTtHQUpzQiIsInNvdXJjZXNDb250ZW50IjpbInVpLlVpRmFjdG9yeS5sYXlvdXRzLmxvYWRNZW51TGF5b3V0ID0ge1xuICAgIFwidHlwZVwiOiBcInVpLkZyZWVMYXlvdXRcIixcbiAgICBcImZyYW1lXCI6IFswLCAwLCBHcmFwaGljcy53aWR0aCwgR3JhcGhpY3MuaGVpZ2h0XSxcbiAgICBcInByZWxvYWRcIjogeyBncmFwaGljczogW25hbWU6ICQgLT4gJGRhdGFGaWVsZHMuZGF0YWJhc2Uuc3lzdGVtLm1lbnVCYWNrZ3JvdW5kLm5hbWUgb3IgJ2JnLWdlbmVyaWMnXSB9LFxuICAgIFwiY29udHJvbHNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgICBcInR5cGVcIjogXCJ1aS5JbWFnZVwiLFxuICAgICAgICAgICAgXCJpbWFnZVwiOiAtPiAkZGF0YUZpZWxkcy5kYXRhYmFzZS5zeXN0ZW0ubWVudUJhY2tncm91bmQubmFtZSBvciAnYmctZ2VuZXJpYydcbiAgICAgICAgICAgIFwiZnJhbWVcIjogWzAsIDAsIEdyYXBoaWNzLndpZHRoLCBHcmFwaGljcy5oZWlnaHRdLFxuICAgICAgICAgICAgXCJhY3Rpb25cIjogeyBcImV2ZW50XCI6IFwib25DYW5jZWxcIiwgXCJuYW1lXCI6IFwicHJldmlvdXNMYXlvdXRcIiwgXCJwYXJhbXNcIjoge319XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInVpLkJhY2tCdXR0b25cIixcbiAgICAgICAgICAgIFwiZnJhbWVcIjogW0dyYXBoaWNzLndpZHRoIC0gMTcwLCBHcmFwaGljcy5oZWlnaHQgLSA2NSwgMTUwLCA0NV1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwidWkuVGl0bGVkV2luZG93XCIsXG4gICAgICAgICAgICBcImZyYW1lXCI6IFsyMCwgMCwgTWF0aC5mbG9vcigoR3JhcGhpY3Mud2lkdGgtMjAwKS80MjApKjQyMCwgR3JhcGhpY3MuaGVpZ2h0XSxcbiAgICAgICAgICAgIFwicGFyYW1zXCI6IHsgXCJ0aXRsZVwiOiB7IFwibGNJZFwiOiBcIkIyMTVGNkVCMjU3Njg4NDU0NzM5OUNDMENGMkYzOEU4NTVGRFwiLCBcImRlZmF1bHRUZXh0XCI6IFwiTG9hZCBHYW1lXCIgfSB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcInVpLkRhdGFTY3JvbGxWaWV3XCIsXG4gICAgICAgICAgICBcImlkXCI6IFwibGlzdFwiLFxuICAgICAgICAgICAgXCJmcmFtZVwiOiBbMjAsIDQ1LCBNYXRoLmZsb29yKChHcmFwaGljcy53aWR0aC0yMDApLzQyMCkqNDIwLCBHcmFwaGljcy5oZWlnaHQgLSA0NV0sXG4gICAgICAgICAgICBcInBhcmFtc1wiOiB7IFxuICAgICAgICAgICAgICAgIFwiY29sdW1uc1wiOiBNYXRoLmZsb29yKChHcmFwaGljcy53aWR0aC0yMDApLzQyMCksXG4gICAgICAgICAgICAgICAgXCJzcGFjaW5nXCI6IFsxMCwgMTBdLFxuICAgICAgICAgICAgICAgIFwiZGF0YVNvdXJjZVwiOiAoJCAtPiAkZGF0YUZpZWxkcy5zYXZlR2FtZVNsb3RzKSwgXG4gICAgICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiZGVzY3JpcHRvclwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ1aS5TYXZlR2FtZVNsb3RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZXhlY3V0ZUZvcm11bGFzXCIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwYXJhbXNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQgLT4gJHRlbXBGaWVsZHMuc2xvdCA9IG8ucGFyZW50LmluZGV4XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY3JlYXRlQ29udHJvbFwiLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uZGl0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBcImZpZWxkXCI6ICgkIC0+ICRkYXRhRmllbGRzLnNhdmVHYW1lU2xvdHNbJHRlbXBGaWVsZHMuc2xvdF0/LmRhdGUpLCBcIm5vdEVxdWFsVG9cIjogKCQgLT4gJycpIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBcImZpZWxkXCI6ICgkIC0+ICRkYXRhRmllbGRzLnNldHRpbmdzLmNvbmZpcm1hdGlvbiksIFwiZXF1YWxUb1wiOiB0cnVlIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBcImZpZWxkXCI6ICgkIC0+ICRkYXRhRmllbGRzLnRlbXBTZXR0aW5ncy5sb2FkTWVudUFjY2VzcyksIFwiZXF1YWxUb1wiOiB0cnVlIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IHsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkZXNjcmlwdG9yXCI6IHsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJjb25maXJtYXRpb25EaWFsb2dcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidWkuQ29uZmlybWF0aW9uRGlhbG9nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiekluZGV4XCI6IDkwMDAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBhcmFtc1wiOiB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJtZXNzYWdlXCI6IHsgXCJsY0lkXCI6IFwiMkJEMDhDQzY1QjlBMjI0OEM3NDlCOUM0REVFQUFERThFMjBBXCIsIFwiZGVmYXVsdFRleHRcIjogXCJEbyB5b3UgcmVhbGx5IHdhbnQgdG8gbG9hZD9cIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhY2NlcHRBY3Rpb25zXCI6IFt7IFwibmFtZVwiOiBcImxvYWRHYW1lXCIsIFwicGFyYW1zXCI6IHsgXCJzbG90XCI6ICgkIC0+ICR0ZW1wRmllbGRzLnNsb3QpIH0gfV0sIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJyZWplY3RBY3Rpb25zXCI6IFt7XCJuYW1lXCI6XCJkaXNwb3NlQ29udHJvbFwiLFwicGFyYW1zXCI6KCQgLT4gJ2NvbmZpcm1hdGlvbkRpYWxvZycpfV19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgXCJjb25kaXRpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgXCJmaWVsZFwiOiAoJCAtPiAkZGF0YUZpZWxkcy5zYXZlR2FtZVNsb3RzWyR0ZW1wRmllbGRzLnNsb3RdPy5kYXRlKSwgXCJub3RFcXVhbFRvXCI6ICgkIC0+ICcnKSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBcImZpZWxkXCI6ICgkIC0+ICEkZGF0YUZpZWxkcy5zZXR0aW5ncy5jb25maXJtYXRpb24gb3IgISRkYXRhRmllbGRzLnRlbXBTZXR0aW5ncy5sb2FkTWVudUFjY2VzcyksIFwiZXF1YWxUb1wiOiB0cnVlIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSwgXCJuYW1lXCI6IFwibG9hZEdhbWVcIiwgXCJwYXJhbXNcIjogeyBcInNsb3RcIjogKCQgLT4gJHRlbXBGaWVsZHMuc2xvdCkgfSB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgXVxufSJdfQ==
//# sourceURL=Layout_LoadMenu_113.js