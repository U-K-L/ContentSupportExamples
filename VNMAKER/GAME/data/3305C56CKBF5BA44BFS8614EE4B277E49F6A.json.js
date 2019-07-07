GS.dataCache['3305C56CKBF5BA44BFS8614EE4B277E49F6A'] = {
    "uid": "3305C56CKBF5BA44BFS8614EE4B277E49F6A",
    "isLoaded": true,
    "lastModificationTime": 0,
    "items": {
        "name": "Sample Scene",
        "type": "vn.scene",
        "parentId": "49DC3EE6267197419859C9E4D23776294B50",
        "chapterUid": "49DC3EE6267197419859C9E4D23776294B50",
        "order": 0,
        "commands": [
            {
                "id": "vn.MessageBoxVisibility",
                "params": {
                    "duration": 0,
                    "waitForCompletion": true,
                    "visible": 0,
                    "animation": {
                        "type": 0,
                        "movement": 3,
                        "mask": {
                            "graphic": null,
                            "vague": 30
                        }
                    },
                    "easing": {
                        "type": 0,
                        "inOut": 1
                    },
                    "fieldFlags": {
                        "duration": 0,
                        "easing.type": 1,
                        "animation.type": 1
                    },
                    "id": "messageBox"
                },
                "indent": 0,
                "expanded": false
            },
            {
                "id": "vn.ChangeBackground",
                "params": {
                    "viewport": {
                        "type": "scene"
                    },
                    "graphic": {
                        "name": "Moonlight1",
                        "hue": 0,
                        "opacity": 255,
                        "blending": 0,
                        "tone": {
                            "red": 0,
                            "green": 0,
                            "blue": 0,
                            "grey": 0
                        }
                    },
                    "layer": 0,
                    "duration": 0,
                    "waitForCompletion": 0,
                    "blendMode": 0,
                    "origin": 0,
                    "zOrder": 0,
                    "loopVertical": 0,
                    "loopHorizontal": 0,
                    "easing": {
                        "type": 0,
                        "inOut": 1
                    },
                    "animation": {
                        "type": 1,
                        "movement": 0,
                        "mask": {
                            "graphic": null,
                            "vague": 30
                        }
                    },
                    "fieldFlags": {
                        "duration": 1,
                        "easing.type": 1,
                        "animation.type": 0,
                        "origin": 1,
                        "zOrder": 1,
                        "blendMode": 1,
                        "viewport.type": 1,
                        "loopVertical": 1,
                        "loopHorizontal": 1
                    },
                    "previewBackground": {
                        "name": "$live_preview_snapshot"
                    }
                },
                "indent": 0,
                "uid": "562992E02D5ED7424C6A5A18DFFC23B91D20",
                "expanded": false
            },
            {
                "id": "gs.ChangeNumberVariables",
                "params": {
                    "target": 0,
                    "targetVariable": {
                        "name": "Patreon",
                        "index": 2,
                        "scope": 1,
                        "changed": true,
                        "domain": "com.degica.vnm.default"
                    },
                    "targetScope": 0,
                    "targetRange": {
                        "start": 0,
                        "end": 0
                    },
                    "targetReferenceDomain": "com.degica.vnm.default",
                    "targetReference": {
                        "index": 0,
                        "scope": 1
                    },
                    "operation": 0,
                    "source": 0,
                    "sourceValue": 2500,
                    "sourceRandom": {
                        "start": 0,
                        "end": 0
                    },
                    "sourceScope": 0,
                    "sourceVariable": {
                        "index": 0,
                        "scope": 1
                    },
                    "sourceReferenceDomain": "com.degica.vnm.default",
                    "sourceReference": {
                        "index": 0,
                        "scope": 1
                    },
                    "previewBackground": {
                        "name": "$live_preview_snapshot"
                    }
                },
                "uid": "D6EDADDB2064924A834BA7A60E650C931E62",
                "indent": 0
            },
            {
                "id": "vn.Choice",
                "params": {
                    "action": {
                        "type": 1,
                        "bindValue": 0,
                        "bindValueVariable": {
                            "scope": 0,
                            "index": 0
                        },
                        "commonEventId": "C9AADAB55C32194019592D65076CFAE850D4",
                        "label": "",
                        "switch": {
                            "scope": 1,
                            "index": 0
                        },
                        "scene": null
                    },
                    "text": {
                        "lcId": "FBE27B7A412C184C9A1803A8417EF32FAAE9",
                        "defaultText": "Onestep"
                    },
                    "label": "",
                    "enabled": 1,
                    "positionType": 0,
                    "box": {
                        "x": 0,
                        "y": 0,
                        "size": {
                            "width": 300,
                            "height": 50
                        }
                    },
                    "defaultChoice": 0
                },
                "uid": "F12EA6DF6C7243475A38F0B3B644C3A83E81",
                "indent": 0
            },
            {
                "id": "vn.Choice",
                "params": {
                    "action": {
                        "type": 1,
                        "bindValue": 0,
                        "bindValueVariable": {
                            "scope": 0,
                            "index": 0
                        },
                        "commonEventId": "FC03EE224F82554A3A797F21A667A385551C",
                        "label": "",
                        "switch": {
                            "scope": 1,
                            "index": 0
                        },
                        "scene": null
                    },
                    "text": {
                        "lcId": "C384057E35E6D348611AFE67EF70B61CDD56",
                        "defaultText": "Twostep"
                    },
                    "label": "",
                    "enabled": 1,
                    "positionType": 0,
                    "box": {
                        "x": 0,
                        "y": 0,
                        "size": {
                            "width": 300,
                            "height": 50
                        }
                    },
                    "defaultChoice": 0
                },
                "uid": "2165F8AF883D6548AF2A7191FDD082182968",
                "indent": 0
            },
            {
                "id": "vn.ShowChoices",
                "params": {},
                "uid": "BE1138623AD53546C82867911B30C2BC1A0C",
                "indent": 0
            },
            {
                "id": "gs.Condition",
                "params": {
                    "variable": {
                        "name": "Total",
                        "index": 3,
                        "scope": 1,
                        "domain": "com.degica.vnm.default",
                        "changed": true
                    },
                    "numberValue": 0,
                    "textValue": "",
                    "switchValue": 0,
                    "valueType": 0,
                    "operation": 2,
                    "previewBackground": {
                        "name": "$live_preview_snapshot"
                    }
                },
                "uid": "2362ABC445CDB9480A1BD4433626B24DB85D",
                "indent": 0
            },
            {
                "id": "gs.ShowMessage",
                "params": {
                    "waitForCompletion": 1,
                    "duration": 15,
                    "expressionId": null,
                    "custom": {
                        "object": {
                            "x": 0,
                            "y": 0,
                            "size": {
                                "width": 300,
                                "height": 100
                            }
                        }
                    },
                    "message": {
                        "lcId": "252E96BC507D104B1F88D2B31A7720BFDDE2",
                        "defaultText": "\nThank you for pledging"
                    },
                    "position": 0,
                    "characterId": 0,
                    "partial": 0,
                    "fieldFlags": {
                        "duration": 1
                    },
                    "expressions": [],
                    "animations": []
                },
                "uid": "0C26EE293FE32448522B44A304A2787D8E8D",
                "indent": 1,
                "expanded": true
            }
        ],
        "background": {
            "graphic": {
                "name": ""
            },
            "offsetX": 0,
            "offsetY": 0
        },
        "localizableStrings": {
            "92E60EBF1750D84D647865F745B06D039A8C": {
                "t": "Continue using the browser...",
                "d": {
                    "cid": 0,
                    "eid": "F8849A62457A534E1E7A9F96C1C4C4E0CFC8"
                }
            },
            "BBA30FAA66CBD642327A78F7AF5A73E8F06B": {
                "t": "{S:2}Waiting for request........",
                "d": {
                    "cid": 0,
                    "eid": "9A83E4DD1FED5548665926E72D842BF0AD0D"
                }
            },
            "03FCE2F34FE8974D30498E465056E7D21E51": {
                "t": "You have pledged: {GN:4}",
                "d": {
                    "cid": 0,
                    "eid": "0E2EAEFE917738402729C812FBDA914E545E"
                }
            },
            "FBE27B7A412C184C9A1803A8417EF32FAAE9": {
                "t": "Onestep",
                "d": {
                    "eid": "F12EA6DF6C7243475A38F0B3B644C3A83E81"
                }
            },
            "C384057E35E6D348611AFE67EF70B61CDD56": {
                "t": "Twostep",
                "d": {
                    "eid": "2165F8AF883D6548AF2A7191FDD082182968"
                }
            },
            "252E96BC507D104B1F88D2B31A7720BFDDE2": {
                "t": "\nThank you for pledging",
                "d": {
                    "cid": 0,
                    "eid": "0C26EE293FE32448522B44A304A2787D8E8D"
                }
            }
        },
        "numberVariables": [
            {
                "name": "",
                "index": 0,
                "scope": 0
            },
            {
                "name": "",
                "index": 1,
                "scope": 1,
                "domain": "com.degica.vnm.default"
            },
            {
                "name": "",
                "index": 2,
                "scope": 0,
                "domain": "com.degica.vnm.default"
            }
        ],
        "booleanVariables": [
            {
                "name": "",
                "index": 0,
                "scope": 0
            }
        ],
        "stringVariables": [
            {
                "name": "",
                "index": 0,
                "scope": 0
            }
        ],
        "listVariables": [
            {
                "name": "",
                "index": 0,
                "scope": 0
            }
        ]
    },
    "summary": [
        "name",
        "type",
        "parentId",
        "chapterUid",
        "order"
    ]
}