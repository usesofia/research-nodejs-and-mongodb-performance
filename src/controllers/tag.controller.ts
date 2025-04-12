import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TagService } from '../services/tag.service';
import { CreateTagDto } from '../dto/tag.dto';

@Controller('/organizations/:organizationId/tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  async create(
    @Param('organizationId') organizationId: string,
    @Body() createTagDto: CreateTagDto,
  ) {
    return this.tagService.create(Number(organizationId), createTagDto.name);
  }

  @Get()
  async findAll(
    @Param('organizationId') organizationId: string,
    @Query('page') page: string = '1',
    @Query('page_size') pageSize: string = '20',
  ) {
    return this.tagService.findAll(
      Number(organizationId),
      Number(page),
      Number(pageSize),
    );
  }
}
