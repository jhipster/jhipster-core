/*eslint-disable */
const serializedGrammar = [
	{
		"type": "Rule",
		"name": "prog",
		"definition": [
			{
				"type": "Repetition",
				"definition": [
					{
						"type": "Alternation",
						"definition": [
							{
								"type": "Flat",
								"definition": [
									{
										"type": "NonTerminal",
										"name": "entityDeclaration",
										"idx": 0
									}
								]
							},
							{
								"type": "Flat",
								"definition": [
									{
										"type": "NonTerminal",
										"name": "relationDeclaration",
										"idx": 0
									}
								]
							},
							{
								"type": "Flat",
								"definition": [
									{
										"type": "NonTerminal",
										"name": "enumDeclaration",
										"idx": 0
									}
								]
							},
							{
								"type": "Flat",
								"definition": [
									{
										"type": "NonTerminal",
										"name": "dtoDeclaration",
										"idx": 0
									}
								]
							},
							{
								"type": "Flat",
								"definition": [
									{
										"type": "NonTerminal",
										"name": "paginationDeclaration",
										"idx": 0
									}
								]
							},
							{
								"type": "Flat",
								"definition": [
									{
										"type": "NonTerminal",
										"name": "serviceDeclaration",
										"idx": 0
									}
								]
							},
							{
								"type": "Flat",
								"definition": [
									{
										"type": "Terminal",
										"name": "COMMENT",
										"label": "COMMENT",
										"idx": 0,
										"pattern": "\\/\\*([\\s\\S]*?)\\*\\/"
									}
								]
							},
							{
								"type": "Flat",
								"definition": [
									{
										"type": "NonTerminal",
										"name": "microserviceDeclaration",
										"idx": 0
									}
								]
							},
							{
								"type": "Flat",
								"definition": [
									{
										"type": "NonTerminal",
										"name": "searchEngineDeclaration",
										"idx": 0
									}
								]
							},
							{
								"type": "Flat",
								"definition": [
									{
										"type": "NonTerminal",
										"name": "noClientDeclaration",
										"idx": 0
									}
								]
							},
							{
								"type": "Flat",
								"definition": [
									{
										"type": "NonTerminal",
										"name": "noServerDeclaration",
										"idx": 0
									}
								]
							},
							{
								"type": "Flat",
								"definition": [
									{
										"type": "NonTerminal",
										"name": "angularSuffixDeclaration",
										"idx": 0
									}
								]
							},
							{
								"type": "Flat",
								"definition": [
									{
										"type": "NonTerminal",
										"name": "noFluentMethod",
										"idx": 0
									}
								]
							},
							{
								"type": "Flat",
								"definition": [
									{
										"type": "NonTerminal",
										"name": "filterDeclaration",
										"idx": 0
									}
								]
							},
							{
								"type": "Flat",
								"definition": [
									{
										"type": "NonTerminal",
										"name": "clientRootFolderDeclaration",
										"idx": 0
									}
								]
							},
							{
								"type": "Flat",
								"definition": [
									{
										"type": "NonTerminal",
										"name": "applicationDeclaration",
										"idx": 0
									}
								]
							},
							{
								"type": "Flat",
								"definition": [
									{
										"type": "NonTerminal",
										"name": "constantDeclaration",
										"idx": 0
									}
								]
							}
						]
					}
				]
			}
		]
	},
	{
		"type": "Rule",
		"name": "constantDeclaration",
		"definition": [
			{
				"type": "Terminal",
				"name": "NAME",
				"label": "NAME",
				"idx": 0,
				"pattern": "[a-zA-Z_][a-zA-Z_\\-\\d]*"
			},
			{
				"type": "Terminal",
				"name": "EQUALS",
				"label": "EQUALS",
				"idx": 0,
				"pattern": "="
			},
			{
				"type": "Terminal",
				"name": "INTEGER",
				"label": "INTEGER",
				"idx": 0,
				"pattern": "-?\\d+"
			}
		]
	},
	{
		"type": "Rule",
		"name": "entityDeclaration",
		"definition": [
			{
				"type": "Option",
				"definition": [
					{
						"type": "Terminal",
						"name": "COMMENT",
						"label": "COMMENT",
						"idx": 0,
						"pattern": "\\/\\*([\\s\\S]*?)\\*\\/"
					}
				]
			},
			{
				"type": "Terminal",
				"name": "ENTITY",
				"label": "ENTITY",
				"idx": 0,
				"pattern": "entity"
			},
			{
				"type": "Terminal",
				"name": "NAME",
				"label": "NAME",
				"idx": 0,
				"pattern": "[a-zA-Z_][a-zA-Z_\\-\\d]*"
			},
			{
				"type": "Option",
				"definition": [
					{
						"type": "NonTerminal",
						"name": "entityTableNameDeclaration",
						"idx": 0
					}
				]
			},
			{
				"type": "Option",
				"definition": [
					{
						"type": "NonTerminal",
						"name": "entityBody",
						"idx": 0
					}
				]
			}
		]
	},
	{
		"type": "Rule",
		"name": "entityTableNameDeclaration",
		"definition": [
			{
				"type": "Terminal",
				"name": "LPAREN",
				"label": "LPAREN",
				"idx": 0,
				"pattern": "("
			},
			{
				"type": "Terminal",
				"name": "NAME",
				"label": "NAME",
				"idx": 0,
				"pattern": "[a-zA-Z_][a-zA-Z_\\-\\d]*"
			},
			{
				"type": "Terminal",
				"name": "RPAREN",
				"label": "RPAREN",
				"idx": 0,
				"pattern": ")"
			}
		]
	},
	{
		"type": "Rule",
		"name": "entityBody",
		"definition": [
			{
				"type": "Terminal",
				"name": "LCURLY",
				"label": "LCURLY",
				"idx": 0,
				"pattern": "{"
			},
			{
				"type": "Repetition",
				"definition": [
					{
						"type": "NonTerminal",
						"name": "fieldDeclaration",
						"idx": 0
					},
					{
						"type": "Option",
						"definition": [
							{
								"type": "Terminal",
								"name": "COMMA",
								"label": "COMMA",
								"idx": 0,
								"pattern": ","
							}
						]
					}
				]
			},
			{
				"type": "Terminal",
				"name": "RCURLY",
				"label": "RCURLY",
				"idx": 0,
				"pattern": "}"
			}
		]
	},
	{
		"type": "Rule",
		"name": "fieldDeclaration",
		"definition": [
			{
				"type": "Option",
				"definition": [
					{
						"type": "Terminal",
						"name": "COMMENT",
						"label": "COMMENT",
						"idx": 0,
						"pattern": "\\/\\*([\\s\\S]*?)\\*\\/"
					}
				]
			},
			{
				"type": "Terminal",
				"name": "NAME",
				"label": "NAME",
				"idx": 0,
				"pattern": "[a-zA-Z_][a-zA-Z_\\-\\d]*"
			},
			{
				"type": "NonTerminal",
				"name": "type",
				"idx": 0
			},
			{
				"type": "Repetition",
				"definition": [
					{
						"type": "NonTerminal",
						"name": "validation",
						"idx": 0
					}
				]
			},
			{
				"type": "Option",
				"definition": [
					{
						"type": "Terminal",
						"name": "COMMENT",
						"label": "COMMENT",
						"idx": 2,
						"pattern": "\\/\\*([\\s\\S]*?)\\*\\/"
					}
				]
			}
		]
	},
	{
		"type": "Rule",
		"name": "type",
		"definition": [
			{
				"type": "Terminal",
				"name": "NAME",
				"label": "NAME",
				"idx": 0,
				"pattern": "[a-zA-Z_][a-zA-Z_\\-\\d]*"
			}
		]
	},
	{
		"type": "Rule",
		"name": "validation",
		"definition": [
			{
				"type": "Alternation",
				"definition": [
					{
						"type": "Flat",
						"definition": [
							{
								"type": "Terminal",
								"name": "REQUIRED",
								"label": "REQUIRED",
								"idx": 0,
								"pattern": "required"
							}
						]
					},
					{
						"type": "Flat",
						"definition": [
							{
								"type": "NonTerminal",
								"name": "minMaxValidation",
								"idx": 0
							}
						]
					},
					{
						"type": "Flat",
						"definition": [
							{
								"type": "NonTerminal",
								"name": "pattern",
								"idx": 0
							}
						]
					}
				]
			}
		]
	},
	{
		"type": "Rule",
		"name": "minMaxValidation",
		"definition": [
			{
				"type": "Terminal",
				"name": "MIN_MAX_KEYWORD",
				"label": "MIN_MAX_KEYWORD",
				"idx": 0,
				"pattern": "NOT_APPLICABLE"
			},
			{
				"type": "Terminal",
				"name": "LPAREN",
				"label": "LPAREN",
				"idx": 0,
				"pattern": "("
			},
			{
				"type": "Alternation",
				"definition": [
					{
						"type": "Flat",
						"definition": [
							{
								"type": "Terminal",
								"name": "INTEGER",
								"label": "INTEGER",
								"idx": 0,
								"pattern": "-?\\d+"
							}
						]
					},
					{
						"type": "Flat",
						"definition": [
							{
								"type": "Terminal",
								"name": "NAME",
								"label": "NAME",
								"idx": 0,
								"pattern": "[a-zA-Z_][a-zA-Z_\\-\\d]*"
							}
						]
					}
				]
			},
			{
				"type": "Terminal",
				"name": "RPAREN",
				"label": "RPAREN",
				"idx": 0,
				"pattern": ")"
			}
		]
	},
	{
		"type": "Rule",
		"name": "pattern",
		"definition": [
			{
				"type": "Terminal",
				"name": "PATTERN",
				"label": "PATTERN",
				"idx": 0,
				"pattern": "pattern"
			},
			{
				"type": "Terminal",
				"name": "LPAREN",
				"label": "LPAREN",
				"idx": 0,
				"pattern": "("
			},
			{
				"type": "Terminal",
				"name": "REGEX",
				"label": "REGEX",
				"idx": 0,
				"pattern": "\\/[^\\n\\r\\/]*\\/"
			},
			{
				"type": "Terminal",
				"name": "RPAREN",
				"label": "RPAREN",
				"idx": 0,
				"pattern": ")"
			}
		]
	},
	{
		"type": "Rule",
		"name": "relationDeclaration",
		"definition": [
			{
				"type": "Terminal",
				"name": "RELATIONSHIP",
				"label": "RELATIONSHIP",
				"idx": 0,
				"pattern": "relationship"
			},
			{
				"type": "NonTerminal",
				"name": "relationshipType",
				"idx": 0
			},
			{
				"type": "Terminal",
				"name": "LCURLY",
				"label": "LCURLY",
				"idx": 0,
				"pattern": "{"
			},
			{
				"type": "RepetitionMandatory",
				"definition": [
					{
						"type": "NonTerminal",
						"name": "relationshipBody",
						"idx": 0
					},
					{
						"type": "Option",
						"definition": [
							{
								"type": "Terminal",
								"name": "COMMA",
								"label": "COMMA",
								"idx": 0,
								"pattern": ","
							}
						]
					}
				]
			},
			{
				"type": "Terminal",
				"name": "RCURLY",
				"label": "RCURLY",
				"idx": 0,
				"pattern": "}"
			}
		]
	},
	{
		"type": "Rule",
		"name": "relationshipType",
		"definition": [
			{
				"type": "Alternation",
				"definition": [
					{
						"type": "Flat",
						"definition": [
							{
								"type": "Terminal",
								"name": "ONE_TO_ONE",
								"label": "ONE_TO_ONE",
								"idx": 0,
								"pattern": "OneToOne"
							}
						]
					},
					{
						"type": "Flat",
						"definition": [
							{
								"type": "Terminal",
								"name": "ONE_TO_MANY",
								"label": "ONE_TO_MANY",
								"idx": 0,
								"pattern": "OneToMany"
							}
						]
					},
					{
						"type": "Flat",
						"definition": [
							{
								"type": "Terminal",
								"name": "MANY_TO_ONE",
								"label": "MANY_TO_ONE",
								"idx": 0,
								"pattern": "ManyToOne"
							}
						]
					},
					{
						"type": "Flat",
						"definition": [
							{
								"type": "Terminal",
								"name": "MANY_TO_MANY",
								"label": "MANY_TO_MANY",
								"idx": 0,
								"pattern": "ManyToMany"
							}
						]
					}
				]
			}
		]
	},
	{
		"type": "Rule",
		"name": "relationshipBody",
		"definition": [
			{
				"type": "NonTerminal",
				"name": "relationshipSide",
				"idx": 0
			},
			{
				"type": "Terminal",
				"name": "TO",
				"label": "TO",
				"idx": 0,
				"pattern": "to"
			},
			{
				"type": "NonTerminal",
				"name": "relationshipSide",
				"idx": 2
			}
		]
	},
	{
		"type": "Rule",
		"name": "relationshipSide",
		"definition": [
			{
				"type": "NonTerminal",
				"name": "comment",
				"idx": 0
			},
			{
				"type": "Terminal",
				"name": "NAME",
				"label": "NAME",
				"idx": 0,
				"pattern": "[a-zA-Z_][a-zA-Z_\\-\\d]*"
			},
			{
				"type": "Option",
				"definition": [
					{
						"type": "Terminal",
						"name": "LCURLY",
						"label": "LCURLY",
						"idx": 0,
						"pattern": "{"
					},
					{
						"type": "Terminal",
						"name": "NAME",
						"label": "NAME",
						"idx": 2,
						"pattern": "[a-zA-Z_][a-zA-Z_\\-\\d]*"
					},
					{
						"type": "Option",
						"definition": [
							{
								"type": "Terminal",
								"name": "LPAREN",
								"label": "LPAREN",
								"idx": 0,
								"pattern": "("
							},
							{
								"type": "Terminal",
								"name": "NAME",
								"label": "NAME",
								"idx": 3,
								"pattern": "[a-zA-Z_][a-zA-Z_\\-\\d]*"
							},
							{
								"type": "Terminal",
								"name": "RPAREN",
								"label": "RPAREN",
								"idx": 0,
								"pattern": ")"
							}
						]
					},
					{
						"type": "Option",
						"definition": [
							{
								"type": "Terminal",
								"name": "REQUIRED",
								"label": "REQUIRED",
								"idx": 0,
								"pattern": "required"
							}
						]
					},
					{
						"type": "Terminal",
						"name": "RCURLY",
						"label": "RCURLY",
						"idx": 0,
						"pattern": "}"
					}
				]
			}
		]
	},
	{
		"type": "Rule",
		"name": "enumDeclaration",
		"definition": [
			{
				"type": "Terminal",
				"name": "ENUM",
				"label": "ENUM",
				"idx": 0,
				"pattern": "enum"
			},
			{
				"type": "Terminal",
				"name": "NAME",
				"label": "NAME",
				"idx": 0,
				"pattern": "[a-zA-Z_][a-zA-Z_\\-\\d]*"
			},
			{
				"type": "Terminal",
				"name": "LCURLY",
				"label": "LCURLY",
				"idx": 0,
				"pattern": "{"
			},
			{
				"type": "NonTerminal",
				"name": "enumPropList",
				"idx": 0
			},
			{
				"type": "Terminal",
				"name": "RCURLY",
				"label": "RCURLY",
				"idx": 0,
				"pattern": "}"
			}
		]
	},
	{
		"type": "Rule",
		"name": "enumPropList",
		"definition": [
			{
				"type": "Terminal",
				"name": "NAME",
				"label": "NAME",
				"idx": 0,
				"pattern": "[a-zA-Z_][a-zA-Z_\\-\\d]*"
			},
			{
				"type": "Repetition",
				"definition": [
					{
						"type": "Terminal",
						"name": "COMMA",
						"label": "COMMA",
						"idx": 0,
						"pattern": ","
					},
					{
						"type": "Terminal",
						"name": "NAME",
						"label": "NAME",
						"idx": 2,
						"pattern": "[a-zA-Z_][a-zA-Z_\\-\\d]*"
					}
				]
			}
		]
	},
	{
		"type": "Rule",
		"name": "dtoDeclaration",
		"definition": [
			{
				"type": "Terminal",
				"name": "DTO",
				"label": "DTO",
				"idx": 0,
				"pattern": "dto"
			},
			{
				"type": "NonTerminal",
				"name": "entityList",
				"idx": 0
			},
			{
				"type": "Option",
				"definition": [
					{
						"type": "NonTerminal",
						"name": "exclusion",
						"idx": 0
					}
				]
			}
		]
	},
	{
		"type": "Rule",
		"name": "entityList",
		"definition": [
			{
				"type": "Repetition",
				"definition": [
					{
						"type": "Terminal",
						"name": "NAME",
						"label": "NAME",
						"idx": 0,
						"pattern": "[a-zA-Z_][a-zA-Z_\\-\\d]*"
					},
					{
						"type": "Terminal",
						"name": "COMMA",
						"label": "COMMA",
						"idx": 0,
						"pattern": ","
					}
				]
			},
			{
				"type": "Alternation",
				"definition": [
					{
						"type": "Flat",
						"definition": [
							{
								"type": "Terminal",
								"name": "ALL",
								"label": "ALL",
								"idx": 0,
								"pattern": "all"
							}
						]
					},
					{
						"type": "Flat",
						"definition": [
							{
								"type": "Terminal",
								"name": "STAR",
								"label": "STAR",
								"idx": 0,
								"pattern": "*"
							}
						]
					},
					{
						"type": "Flat",
						"definition": [
							{
								"type": "Terminal",
								"name": "NAME",
								"label": "NAME",
								"idx": 1,
								"pattern": "[a-zA-Z_][a-zA-Z_\\-\\d]*"
							}
						]
					}
				]
			},
			{
				"type": "Terminal",
				"name": "WITH",
				"label": "WITH",
				"idx": 0,
				"pattern": "with"
			},
			{
				"type": "Terminal",
				"name": "NAME",
				"label": "NAME",
				"idx": 2,
				"pattern": "[a-zA-Z_][a-zA-Z_\\-\\d]*"
			}
		]
	},
	{
		"type": "Rule",
		"name": "exclusion",
		"definition": [
			{
				"type": "Terminal",
				"name": "EXCEPT",
				"label": "EXCEPT",
				"idx": 0,
				"pattern": "except"
			},
			{
				"type": "Terminal",
				"name": "NAME",
				"label": "NAME",
				"idx": 0,
				"pattern": "[a-zA-Z_][a-zA-Z_\\-\\d]*"
			},
			{
				"type": "Repetition",
				"definition": [
					{
						"type": "Terminal",
						"name": "COMMA",
						"label": "COMMA",
						"idx": 0,
						"pattern": ","
					},
					{
						"type": "Terminal",
						"name": "NAME",
						"label": "NAME",
						"idx": 2,
						"pattern": "[a-zA-Z_][a-zA-Z_\\-\\d]*"
					}
				]
			}
		]
	},
	{
		"type": "Rule",
		"name": "paginationDeclaration",
		"definition": [
			{
				"type": "Terminal",
				"name": "PAGINATE",
				"label": "PAGINATE",
				"idx": 0,
				"pattern": "paginate"
			},
			{
				"type": "NonTerminal",
				"name": "entityList",
				"idx": 0
			},
			{
				"type": "Option",
				"definition": [
					{
						"type": "NonTerminal",
						"name": "exclusion",
						"idx": 0
					}
				]
			}
		]
	},
	{
		"type": "Rule",
		"name": "serviceDeclaration",
		"definition": [
			{
				"type": "Terminal",
				"name": "SERVICE",
				"label": "SERVICE",
				"idx": 0,
				"pattern": "service"
			},
			{
				"type": "NonTerminal",
				"name": "entityList",
				"idx": 0
			},
			{
				"type": "Option",
				"definition": [
					{
						"type": "NonTerminal",
						"name": "exclusion",
						"idx": 0
					}
				]
			}
		]
	},
	{
		"type": "Rule",
		"name": "microserviceDeclaration",
		"definition": [
			{
				"type": "Terminal",
				"name": "MICROSERVICE",
				"label": "MICROSERVICE",
				"idx": 0,
				"pattern": "microservice"
			},
			{
				"type": "NonTerminal",
				"name": "entityList",
				"idx": 0
			},
			{
				"type": "Option",
				"definition": [
					{
						"type": "NonTerminal",
						"name": "exclusion",
						"idx": 0
					}
				]
			}
		]
	},
	{
		"type": "Rule",
		"name": "searchEngineDeclaration",
		"definition": [
			{
				"type": "Terminal",
				"name": "SEARCH",
				"label": "SEARCH",
				"idx": 0,
				"pattern": "search"
			},
			{
				"type": "NonTerminal",
				"name": "entityList",
				"idx": 0
			},
			{
				"type": "Option",
				"definition": [
					{
						"type": "NonTerminal",
						"name": "exclusion",
						"idx": 0
					}
				]
			}
		]
	},
	{
		"type": "Rule",
		"name": "noClientDeclaration",
		"definition": [
			{
				"type": "Terminal",
				"name": "SKIP_CLIENT",
				"label": "SKIP_CLIENT",
				"idx": 0,
				"pattern": "skipClient"
			},
			{
				"type": "NonTerminal",
				"name": "filterDef",
				"idx": 0
			},
			{
				"type": "Option",
				"definition": [
					{
						"type": "NonTerminal",
						"name": "exclusion",
						"idx": 0
					}
				]
			}
		]
	},
	{
		"type": "Rule",
		"name": "noServerDeclaration",
		"definition": [
			{
				"type": "Terminal",
				"name": "SKIP_SERVER",
				"label": "SKIP_SERVER",
				"idx": 0,
				"pattern": "skipServer"
			},
			{
				"type": "NonTerminal",
				"name": "filterDef",
				"idx": 0
			},
			{
				"type": "Option",
				"definition": [
					{
						"type": "NonTerminal",
						"name": "exclusion",
						"idx": 0
					}
				]
			}
		]
	},
	{
		"type": "Rule",
		"name": "noFluentMethod",
		"definition": [
			{
				"type": "Terminal",
				"name": "NO_FLUENT_METHOD",
				"label": "NO_FLUENT_METHOD",
				"idx": 0,
				"pattern": "noFluentMethod"
			},
			{
				"type": "NonTerminal",
				"name": "filterDef",
				"idx": 0
			},
			{
				"type": "Option",
				"definition": [
					{
						"type": "NonTerminal",
						"name": "exclusion",
						"idx": 0
					}
				]
			}
		]
	},
	{
		"type": "Rule",
		"name": "filterDeclaration",
		"definition": [
			{
				"type": "Terminal",
				"name": "FILTER",
				"label": "FILTER",
				"idx": 0,
				"pattern": "filter"
			},
			{
				"type": "NonTerminal",
				"name": "filterDef",
				"idx": 0
			},
			{
				"type": "Option",
				"definition": [
					{
						"type": "NonTerminal",
						"name": "exclusion",
						"idx": 0
					}
				]
			}
		]
	},
	{
		"type": "Rule",
		"name": "clientRootFolderDeclaration",
		"definition": [
			{
				"type": "Terminal",
				"name": "CLIENT_ROOT_FOLDER",
				"label": "CLIENT_ROOT_FOLDER",
				"idx": 0,
				"pattern": "clientRootFolder"
			},
			{
				"type": "NonTerminal",
				"name": "entityList",
				"idx": 0
			},
			{
				"type": "Option",
				"definition": [
					{
						"type": "NonTerminal",
						"name": "exclusion",
						"idx": 0
					}
				]
			}
		]
	},
	{
		"type": "Rule",
		"name": "filterDef",
		"definition": [
			{
				"type": "Repetition",
				"definition": [
					{
						"type": "Terminal",
						"name": "NAME",
						"label": "NAME",
						"idx": 0,
						"pattern": "[a-zA-Z_][a-zA-Z_\\-\\d]*"
					},
					{
						"type": "Terminal",
						"name": "COMMA",
						"label": "COMMA",
						"idx": 0,
						"pattern": ","
					}
				]
			},
			{
				"type": "Alternation",
				"definition": [
					{
						"type": "Flat",
						"definition": [
							{
								"type": "Terminal",
								"name": "ALL",
								"label": "ALL",
								"idx": 0,
								"pattern": "all"
							}
						]
					},
					{
						"type": "Flat",
						"definition": [
							{
								"type": "Terminal",
								"name": "STAR",
								"label": "STAR",
								"idx": 0,
								"pattern": "*"
							}
						]
					},
					{
						"type": "Flat",
						"definition": [
							{
								"type": "Terminal",
								"name": "NAME",
								"label": "NAME",
								"idx": 1,
								"pattern": "[a-zA-Z_][a-zA-Z_\\-\\d]*"
							}
						]
					}
				]
			}
		]
	},
	{
		"type": "Rule",
		"name": "angularSuffixDeclaration",
		"definition": [
			{
				"type": "Terminal",
				"name": "ANGULAR_SUFFIX",
				"label": "ANGULAR_SUFFIX",
				"idx": 0,
				"pattern": "angularSuffix"
			},
			{
				"type": "NonTerminal",
				"name": "entityList",
				"idx": 0
			},
			{
				"type": "Option",
				"definition": [
					{
						"type": "NonTerminal",
						"name": "exclusion",
						"idx": 0
					}
				]
			}
		]
	},
	{
		"type": "Rule",
		"name": "comment",
		"definition": [
			{
				"type": "Option",
				"definition": [
					{
						"type": "Terminal",
						"name": "COMMENT",
						"label": "COMMENT",
						"idx": 0,
						"pattern": "\\/\\*([\\s\\S]*?)\\*\\/"
					}
				]
			}
		]
	},
	{
		"type": "Rule",
		"name": "applicationDeclaration",
		"definition": [
			{
				"type": "Terminal",
				"name": "APPLICATION",
				"label": "APPLICATION",
				"idx": 0,
				"pattern": "application"
			},
			{
				"type": "Terminal",
				"name": "LCURLY",
				"label": "LCURLY",
				"idx": 0,
				"pattern": "{"
			},
			{
				"type": "NonTerminal",
				"name": "applicationSubDeclaration",
				"idx": 0
			},
			{
				"type": "Terminal",
				"name": "RCURLY",
				"label": "RCURLY",
				"idx": 0,
				"pattern": "}"
			}
		]
	},
	{
		"type": "Rule",
		"name": "applicationSubDeclaration",
		"definition": [
			{
				"type": "Repetition",
				"definition": [
					{
						"type": "Alternation",
						"definition": [
							{
								"type": "Flat",
								"definition": [
									{
										"type": "NonTerminal",
										"name": "applicationSubConfig",
										"idx": 0
									}
								]
							},
							{
								"type": "Flat",
								"definition": [
									{
										"type": "NonTerminal",
										"name": "applicationSubEntities",
										"idx": 0
									}
								]
							}
						]
					}
				]
			}
		]
	},
	{
		"type": "Rule",
		"name": "applicationSubConfig",
		"definition": [
			{
				"type": "Terminal",
				"name": "CONFIG",
				"label": "CONFIG",
				"idx": 0,
				"pattern": "config"
			},
			{
				"type": "Terminal",
				"name": "LCURLY",
				"label": "LCURLY",
				"idx": 0,
				"pattern": "{"
			},
			{
				"type": "Repetition",
				"definition": [
					{
						"type": "Alternation",
						"definition": [
							{
								"type": "Flat",
								"definition": [
									{
										"type": "Terminal",
										"name": "COMMENT",
										"label": "COMMENT",
										"idx": 0,
										"pattern": "\\/\\*([\\s\\S]*?)\\*\\/"
									}
								]
							},
							{
								"type": "Flat",
								"definition": [
									{
										"type": "NonTerminal",
										"name": "applicationConfigDeclaration",
										"idx": 0
									}
								]
							}
						]
					}
				]
			},
			{
				"type": "Terminal",
				"name": "RCURLY",
				"label": "RCURLY",
				"idx": 0,
				"pattern": "}"
			}
		]
	},
	{
		"type": "Rule",
		"name": "applicationSubEntities",
		"definition": [
			{
				"type": "Terminal",
				"name": "ENTITIES",
				"label": "ENTITIES",
				"idx": 0,
				"pattern": "entities"
			},
			{
				"type": "NonTerminal",
				"name": "filterDef",
				"idx": 0
			},
			{
				"type": "Option",
				"definition": [
					{
						"type": "NonTerminal",
						"name": "exclusion",
						"idx": 0
					}
				]
			}
		]
	},
	{
		"type": "Rule",
		"name": "applicationConfigDeclaration",
		"definition": [
			{
				"type": "Terminal",
				"name": "CONFIG_KEY",
				"label": "CONFIG_KEY",
				"idx": 0,
				"pattern": "NOT_APPLICABLE"
			},
			{
				"type": "NonTerminal",
				"name": "configValue",
				"idx": 0
			},
			{
				"type": "Option",
				"definition": [
					{
						"type": "Terminal",
						"name": "COMMA",
						"label": "COMMA",
						"idx": 0,
						"pattern": ","
					}
				]
			}
		]
	},
	{
		"type": "Rule",
		"name": "configValue",
		"definition": [
			{
				"type": "Alternation",
				"definition": [
					{
						"type": "Flat",
						"definition": [
							{
								"type": "Terminal",
								"name": "BOOLEAN",
								"label": "BOOLEAN",
								"idx": 0,
								"pattern": "NOT_APPLICABLE"
							}
						]
					},
					{
						"type": "Flat",
						"definition": [
							{
								"type": "NonTerminal",
								"name": "qualifiedName",
								"idx": 0
							}
						]
					},
					{
						"type": "Flat",
						"definition": [
							{
								"type": "NonTerminal",
								"name": "list",
								"idx": 0
							}
						]
					},
					{
						"type": "Flat",
						"definition": [
							{
								"type": "Terminal",
								"name": "INTEGER",
								"label": "INTEGER",
								"idx": 0,
								"pattern": "-?\\d+"
							}
						]
					},
					{
						"type": "Flat",
						"definition": [
							{
								"type": "Terminal",
								"name": "STRING",
								"label": "STRING",
								"idx": 0,
								"pattern": "\"(?:[^\"])*\""
							}
						]
					}
				]
			}
		]
	},
	{
		"type": "Rule",
		"name": "qualifiedName",
		"definition": [
			{
				"type": "RepetitionMandatoryWithSeparator",
				"separator": {
					"type": "Terminal",
					"name": "DOT",
					"label": "DOT",
					"idx": 1,
					"pattern": "."
				},
				"definition": [
					{
						"type": "Terminal",
						"name": "NAME",
						"label": "NAME",
						"idx": 0,
						"pattern": "[a-zA-Z_][a-zA-Z_\\-\\d]*"
					}
				]
			}
		]
	},
	{
		"type": "Rule",
		"name": "list",
		"definition": [
			{
				"type": "Terminal",
				"name": "LSQUARE",
				"label": "LSQUARE",
				"idx": 0,
				"pattern": "["
			},
			{
				"type": "RepetitionMandatoryWithSeparator",
				"separator": {
					"type": "Terminal",
					"name": "COMMA",
					"label": "COMMA",
					"idx": 1,
					"pattern": ","
				},
				"definition": [
					{
						"type": "Terminal",
						"name": "NAME",
						"label": "NAME",
						"idx": 0,
						"pattern": "[a-zA-Z_][a-zA-Z_\\-\\d]*"
					}
				]
			},
			{
				"type": "Terminal",
				"name": "RSQUARE",
				"label": "RSQUARE",
				"idx": 0,
				"pattern": "]"
			}
		]
	}
]