GS.dataCache['FC03EE224F82554A3A797F21A667A385551C'] = {
    "uid": "FC03EE224F82554A3A797F21A667A385551C",
    "isLoaded": true,
    "lastModificationTime": null,
    "items": {
        "name": "TwoStep",
        "type": "data_record",
        "category": "commonEvents",
        "id": "FC03EE224F82554A3A797F21A667A385551C",
        "isFolder": false,
        "data": {
            "name": "TwoStep",
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
                        "script": "OpenContentSupportTwoStep()"
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
                            "lcId": "EAABCE787BD0F840DF1B24A52BAD09192B50",
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
                            "lcId": "F02A6B56394A334B1D3987E28E99566367AC",
                            "defaultText": "Enter the code"
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
                    "uid": "E6583D9A83B3224F097ABE645FF385A11631",
                    "indent": 0,
                    "expanded": true
                },
                {
                    "id": "gs.InputNumber",
                    "params": {
                        "variable": {
                            "name": "Patreon",
                            "index": 2,
                            "scope": 1,
                            "changed": true,
                            "domain": "com.degica.vnm.default"
                        },
                        "digits": 8,
                        "previewBackground": {
                            "name": "$live_preview_snapshot"
                        }
                    },
                    "uid": "C6139D555DB0224B9039E812AD8EE8F3D7EF",
                    "indent": 0
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
                    "uid": "DE4B04A25636D34193798A03C1C54A18BC89",
                    "indent": 0
                },
                {
                    "id": "gs.Script",
                    "params": {
                        "script": "GetPatronTwoStep()"
                    },
                    "uid": "30363FDB756B064B6A4A14F8985A868D3BB0",
                    "indent": 0,
                    "expanded": true
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
                            "lcId": "A6195AF25C4A6448F959669992F5E49A9675",
                            "defaultText": "Waiting for request........"
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
                            "autoErase": 1,
                            "waitAtEnd": 1,
                            "backlog": 1,
                            "font": 1,
                            "size": 1
                        }
                    },
                    "uid": "E908B157260EC440BC9AE3E9FDB2244E419B",
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
                            "lcId": "396D67C7525B4544C6490CE3AD25C6D055C9",
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
            "index": "FC03EE224F82554A3A797F21A667A385551C",
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
        "localizableStrings": {
            "4C2C81DF59DC544FBE5B0D21C5C7BF7990E9": {
                "t": "Continue using the browser..."
            },
            "4350DA622247434F0C4B80C3B528985EB34F": {
                "t": "{S:2}Waiting for request........"
            },
            "9B63E5F56FEC1640A48950A50F08BB55C188": {
                "t": "You have pledged: {GN:4}"
            },
            "EAABCE787BD0F840DF1B24A52BAD09192B50": {
                "t": "Continue using the browser...",
                "d": {
                    "cid": 0,
                    "eid": "F8849A62457A534E1E7A9F96C1C4C4E0CFC8"
                }
            },
            "A6195AF25C4A6448F959669992F5E49A9675": {
                "t": "Waiting for request........",
                "d": {
                    "cid": 0,
                    "eid": "9A83E4DD1FED5548665926E72D842BF0AD0D"
                }
            },
            "396D67C7525B4544C6490CE3AD25C6D055C9": {
                "t": "You have pledged: {GN:4}",
                "d": {
                    "cid": 0,
                    "eid": "0E2EAEFE917738402729C812FBDA914E545E"
                }
            },
            "F02A6B56394A334B1D3987E28E99566367AC": {
                "t": "Enter the code",
                "d": {
                    "cid": 0,
                    "eid": "E6583D9A83B3224F097ABE645FF385A11631"
                }
            }
        },
        "order": 1,
        "parentId": "D531455A1F98D14A873AA0F9CC2734FBDA81"
    },
    "summary": [
        "name",
        "type",
        "order"
    ]
}