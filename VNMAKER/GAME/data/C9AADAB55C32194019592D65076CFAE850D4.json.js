GS.dataCache['C9AADAB55C32194019592D65076CFAE850D4'] = {
    "uid": "C9AADAB55C32194019592D65076CFAE850D4",
    "isLoaded": true,
    "lastModificationTime": null,
    "items": {
        "name": "OneStep",
        "type": "data_record",
        "category": "commonEvents",
        "id": "C9AADAB55C32194019592D65076CFAE850D4",
        "isFolder": false,
        "parentId": "D531455A1F98D14A873AA0F9CC2734FBDA81",
        "data": {
            "name": "OneStep",
            "startCondition": 0,
            "conditionEnabled": false,
            "parallel": false,
            "autoPreload": true,
            "singleInstance": true,
            "inline": false,
            "parameters": [],
            "commands": [
                {
                    "id": "gs.Script",
                    "params": {
                        "script": "OpenContentSupportOneStep()"
                    },
                    "uid": "EC4C86C54A5A4843092A2316CA991DBD4D24",
                    "indent": 0,
                    "expanded": true
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
                            "lcId": "92E60EBF1750D84D647865F745B06D039A8C",
                            "defaultText": "Continue using the browser..."
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
                    "uid": "F8849A62457A534E1E7A9F96C1C4C4E0CFC8",
                    "indent": 0,
                    "expanded": true
                },
                {
                    "id": "gs.MessageSettings",
                    "params": {
                        "useCharacterColor": 0,
                        "paragraphSpacing": 0,
                        "backlog": 1,
                        "bold": 0,
                        "italic": 0,
                        "linePadding": 6,
                        "lineHeight": 0,
                        "lineSpacing": 0,
                        "smallCaps": 0,
                        "underline": 0,
                        "strikeThrough": 0,
                        "autoErase": 1,
                        "waitAtEnd": 0,
                        "font": "Verdana",
                        "size": 40,
                        "outline": 0,
                        "outlineSize": 4,
                        "shadow": 0,
                        "shadowOffsetX": 1,
                        "shadowOffsetY": 1,
                        "color": {
                            "red": 255,
                            "green": 255,
                            "blue": 255,
                            "alpha": 255
                        },
                        "outlineColor": {
                            "red": 0,
                            "green": 0,
                            "blue": 0,
                            "alpha": 255
                        },
                        "shadowColor": {
                            "red": 0,
                            "green": 0,
                            "blue": 0,
                            "alpha": 255
                        },
                        "fieldFlags": {
                            "autoErase": 1,
                            "waitAtEnd": 0,
                            "backlog": 1,
                            "font": 1,
                            "size": 1
                        }
                    },
                    "uid": "EED9EB7C48C764480A3B07A4BBF835ED7E4C",
                    "indent": 0
                },
                {
                    "id": "gs.Label",
                    "params": {
                        "name": "request"
                    },
                    "uid": "62A09AEA5B61304F0188A346D21A2963788C",
                    "indent": 0
                },
                {
                    "id": "gs.Script",
                    "params": {
                        "script": "ContentSupportGetIP();"
                    },
                    "uid": "520ECD7B6558C448F98B9F098D1C792E4DE3",
                    "indent": 0,
                    "expanded": true
                },
                {
                    "id": "gs.ShowMessage",
                    "params": {
                        "waitForCompletion": 1,
                        "duration": 600,
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
                            "lcId": "DF8C7A4C6E934747AE18198983962FBB3361",
                            "defaultText": "{S:3}Waiting for request........"
                        },
                        "position": 0,
                        "characterId": 0,
                        "partial": 0,
                        "fieldFlags": {
                            "duration": 0
                        },
                        "expressions": [],
                        "animations": []
                    },
                    "uid": "9A83E4DD1FED5548665926E72D842BF0AD0D",
                    "indent": 0,
                    "expanded": true
                },
                {
                    "id": "gs.Script",
                    "params": {
                        "script": "if(ContentSupportReturnUserID() > 0){ContentSupportOneStep()}"
                    },
                    "uid": "4E2C94123C55C3416A6967494BE5B91272DC",
                    "indent": 0,
                    "expanded": true
                },
                {
                    "id": "gs.Condition",
                    "params": {
                        "variable": {
                            "name": "Patreon",
                            "index": 2,
                            "scope": 1,
                            "changed": true,
                            "domain": "com.degica.vnm.default"
                        },
                        "numberValue": 0,
                        "textValue": "",
                        "switchValue": 0,
                        "valueType": 0,
                        "operation": 0,
                        "previewBackground": {
                            "name": "$live_preview_snapshot"
                        }
                    },
                    "uid": "E5856C975EA0A24A586AF735CDBB13340C31",
                    "indent": 0
                },
                {
                    "id": "gs.JumpToLabel",
                    "params": {
                        "name": "end request"
                    },
                    "uid": "CFE555953E87864ED56804F6E09C98534E25",
                    "indent": 1
                },
                {
                    "id": "gs.ConditionElse",
                    "params": {},
                    "uid": "E396AA9C6D1EE84BC07A0F02A84B598632BC",
                    "indent": 0
                },
                {
                    "id": "gs.JumpToLabel",
                    "params": {
                        "name": "request"
                    },
                    "uid": "C49043D35B1344468C9B996412FEE981A07A",
                    "indent": 0
                },
                {
                    "id": "gs.Label",
                    "params": {
                        "name": "end request"
                    },
                    "uid": "D02F5F116AB69440A85AEBE664467DBB4D73",
                    "indent": 0
                },
                {
                    "id": "gs.Script",
                    "params": {
                        "script": "getPatronPledgedStatus()"
                    },
                    "uid": "5317489676DB3243283A9AC3E681C9C30978",
                    "indent": 0,
                    "expanded": true
                },
                {
                    "id": "gs.MessageSettings",
                    "params": {
                        "useCharacterColor": 0,
                        "paragraphSpacing": 0,
                        "backlog": 1,
                        "bold": 0,
                        "italic": 0,
                        "linePadding": 6,
                        "lineHeight": 0,
                        "lineSpacing": 0,
                        "smallCaps": 0,
                        "underline": 0,
                        "strikeThrough": 0,
                        "autoErase": 1,
                        "waitAtEnd": 1,
                        "font": "Verdana",
                        "size": 40,
                        "outline": 0,
                        "outlineSize": 4,
                        "shadow": 0,
                        "shadowOffsetX": 1,
                        "shadowOffsetY": 1,
                        "color": {
                            "red": 255,
                            "green": 255,
                            "blue": 255,
                            "alpha": 255
                        },
                        "outlineColor": {
                            "red": 0,
                            "green": 0,
                            "blue": 0,
                            "alpha": 255
                        },
                        "shadowColor": {
                            "red": 0,
                            "green": 0,
                            "blue": 0,
                            "alpha": 255
                        },
                        "fieldFlags": {
                            "autoErase": 0,
                            "waitAtEnd": 0,
                            "backlog": 1,
                            "font": 1,
                            "size": 1
                        }
                    },
                    "uid": "DA0A83EE1703D24372582DC1A786A1E8D8C9",
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
                            "lcId": "03FCE2F34FE8974D30498E465056E7D21E51",
                            "defaultText": "You have pledged: {GN:4}"
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
                    "uid": "0E2EAEFE917738402729C812FBDA914E545E",
                    "indent": 0,
                    "expanded": true
                }
            ],
            "index": "C9AADAB55C32194019592D65076CFAE850D4",
            "booleanVariables": [
                {
                    "name": "",
                    "index": 0,
                    "scope": 0
                }
            ],
            "numberVariables": [
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
            ]
        },
        "order": 0,
        "localizableStrings": {
            "DF8C7A4C6E934747AE18198983962FBB3361": {
                "t": "{S:3}Waiting for request........",
                "d": {
                    "cid": 0,
                    "eid": "9A83E4DD1FED5548665926E72D842BF0AD0D"
                }
            }
        }
    },
    "summary": [
        "name",
        "type",
        "order"
    ]
}